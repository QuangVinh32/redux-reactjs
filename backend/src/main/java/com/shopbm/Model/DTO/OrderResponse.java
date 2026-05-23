package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.Order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String orderCode,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal total,
        String status,
        String paymentMethod,
        String couponCode,
        String note,
        LocalDateTime createdAt,
        LocalDateTime completedAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order o, List<OrderItemResponse> items) {
        return new OrderResponse(
                o.getId(), o.getOrderCode(), o.getSubtotal(), o.getDiscountAmount(), o.getTotal(),
                o.getStatus().name(), o.getPaymentMethod(), o.getCouponCode(), o.getNote(),
                o.getCreatedAt(), o.getCompletedAt(), items
        );
    }
}
