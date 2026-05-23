package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.OrderItemResponse;
import com.shopbm.Model.DTO.OrderResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.*;
import com.shopbm.Model.Enum.*;
import com.shopbm.Model.Request.CreateOrderRequest;
import com.shopbm.Repository.*;
import com.shopbm.Service.IAffiliateService;
import com.shopbm.Service.ICouponService;
import com.shopbm.Service.INotificationService;
import com.shopbm.Service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final ICouponService couponService;
    private final IAffiliateService affiliateService;
    private final INotificationService notificationService;

    @Override
    @Transactional
    public OrderResponse checkout(Long userId, CreateOrderRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw ApiException.badRequest("Đơn hàng rỗng");
        }

        User user = userRepository.findWithLockById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));

        Map<Long, Product> productMap = new HashMap<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CreateOrderRequest.Line line : req.items()) {
            Product p = productRepository.findWithLockById(line.productId())
                    .orElseThrow(() -> ApiException.notFound("Sản phẩm " + line.productId() + " không tồn tại"));
            if (p.getStock() < line.quantity()) {
                throw ApiException.badRequest("Sản phẩm " + p.getName() + " không đủ kho");
            }
            productMap.put(p.getId(), p);
            subtotal = subtotal.add(p.getPrice().multiply(BigDecimal.valueOf(line.quantity())));
        }

        BigDecimal discount = BigDecimal.ZERO;
        if (req.couponCode() != null && !req.couponCode().isBlank()) {
            discount = couponService.calculateDiscount(req.couponCode(), subtotal);
        }
        BigDecimal total = subtotal.subtract(discount).max(BigDecimal.ZERO);

        if (user.getBalance().compareTo(total) < 0) {
            throw ApiException.badRequest("Số dư ví không đủ. Vui lòng nạp thêm tiền.");
        }

        Order order = orderRepository.save(Order.builder()
                .orderCode(generateOrderCode())
                .userId(userId)
                .subtotal(subtotal)
                .discountAmount(discount)
                .total(total)
                .status(OrderStatus.PROCESSING)
                .paymentMethod("WALLET")
                .paymentStatus("PAID")
                .couponCode(req.couponCode())
                .note(req.note())
                .build());

        List<OrderItem> orderItems = new ArrayList<>();
        for (CreateOrderRequest.Line line : req.items()) {
            Product p = productMap.get(line.productId());
            BigDecimal lineSubtotal = p.getPrice().multiply(BigDecimal.valueOf(line.quantity()));
            orderItems.add(OrderItem.builder()
                    .orderId(order.getId())
                    .productId(p.getId())
                    .productNameSnapshot(p.getName())
                    .productPriceSnapshot(p.getPrice())
                    .quantity(line.quantity())
                    .subtotal(lineSubtotal)
                    .deliveredContent("[Demo] Tài khoản " + p.getName() + " #" + System.currentTimeMillis())
                    .build());
            p.setStock(p.getStock() - line.quantity());
            p.setSoldCount(p.getSoldCount() + line.quantity());
        }
        orderItemRepository.saveAll(orderItems);

        BigDecimal before = user.getBalance();
        BigDecimal after = before.subtract(total);
        user.setBalance(after);
        transactionRepository.save(Transaction.builder()
                .userId(userId)
                .type(TransactionType.PURCHASE)
                .method(TransactionMethod.WALLET)
                .amount(total.negate())
                .bonusAmount(BigDecimal.ZERO)
                .netAmount(total.negate())
                .balanceBefore(before)
                .balanceAfter(after)
                .status(TransactionStatus.COMPLETED)
                .orderId(order.getId())
                .description("Thanh toán đơn " + order.getOrderCode())
                .completedAt(LocalDateTime.now())
                .build());

        if (req.couponCode() != null && !req.couponCode().isBlank()) {
            couponService.consume(userId, req.couponCode(), order.getId());
        }

        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());

        if (user.getReferrerId() != null) {
            affiliateService.recordCommission(user.getReferrerId(), user.getId(), order.getId(), total);
        }

        notificationService.create(userId, NotificationType.ORDER,
                "Đơn hàng " + order.getOrderCode() + " thành công",
                "Tổng " + total + "đ đã được thanh toán. Cảm ơn bạn!");

        return OrderResponse.from(order, orderItems.stream().map(OrderItemResponse::from).toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse get(Long userId, Long orderId) {
        Order o = orderRepository.findById(orderId)
                .orElseThrow(() -> ApiException.notFound("Đơn hàng không tồn tại"));
        if (!o.getUserId().equals(userId)) throw ApiException.forbidden("Không có quyền xem đơn này");
        var items = orderItemRepository.findAllByOrderId(orderId).stream()
                .map(OrderItemResponse::from).toList();
        return OrderResponse.from(o, items);
    }

    @Override
    public PageResponse<OrderResponse> myOrders(Long userId, Pageable pageable) {
        return PageResponse.from(orderRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable),
                o -> {
                    var items = orderItemRepository.findAllByOrderId(o.getId()).stream()
                            .map(OrderItemResponse::from).toList();
                    return OrderResponse.from(o, items);
                });
    }

    @Override
    public Map<String, Long> myStats(Long userId) {
        return Map.of(
                "total", orderRepository.countByUserId(userId),
                "completed", orderRepository.countByUserIdAndStatus(userId, OrderStatus.COMPLETED),
                "processing", orderRepository.countByUserIdAndStatus(userId, OrderStatus.PROCESSING),
                "refunded", orderRepository.countByUserIdAndStatus(userId, OrderStatus.REFUNDED)
        );
    }

    private String generateOrderCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "ORD-" + date + "-" + String.format("%04d", ThreadLocalRandom.current().nextInt(1, 9999));
    }
}
