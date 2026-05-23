package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.CartItemResponse;
import com.shopbm.Model.DTO.CartResponse;
import com.shopbm.Model.Entity.Cart;
import com.shopbm.Model.Entity.CartItem;
import com.shopbm.Model.Entity.Product;
import com.shopbm.Model.Request.AddToCartRequest;
import com.shopbm.Repository.CartItemRepository;
import com.shopbm.Repository.CartRepository;
import com.shopbm.Repository.ProductRepository;
import com.shopbm.Service.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public CartResponse view(Long userId) {
        Cart cart = ensureCart(userId);
        List<CartItem> items = cartItemRepository.findAllByCartId(cart.getId());
        if (items.isEmpty()) return new CartResponse(cart.getId(), List.of(), BigDecimal.ZERO, 0);

        Map<Long, Product> productMap = new HashMap<>();
        productRepository.findAllById(items.stream().map(CartItem::getProductId).toList())
                .forEach(p -> productMap.put(p.getId(), p));

        BigDecimal subtotal = BigDecimal.ZERO;
        int totalQty = 0;
        List<CartItemResponse> responses = new ArrayList<>();
        for (CartItem ci : items) {
            Product p = productMap.get(ci.getProductId());
            if (p == null) continue;
            BigDecimal lineSubtotal = p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            subtotal = subtotal.add(lineSubtotal);
            totalQty += ci.getQuantity();
            responses.add(new CartItemResponse(ci.getId(), p.getId(), p.getName(),
                    p.getImageUrl(), p.getPrice(), ci.getQuantity(), lineSubtotal));
        }
        return new CartResponse(cart.getId(), responses, subtotal, totalQty);
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, AddToCartRequest req) {
        Cart cart = ensureCart(userId);
        Product product = productRepository.findById(req.productId())
                .orElseThrow(() -> ApiException.notFound("Sản phẩm không tồn tại"));
        if (product.getStock() < req.quantity()) {
            throw ApiException.badRequest("Sản phẩm không đủ kho");
        }
        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElseGet(() -> CartItem.builder().cartId(cart.getId())
                        .productId(product.getId()).quantity(0).build());
        item.setQuantity(item.getQuantity() + req.quantity());
        cartItemRepository.save(item);
        return view(userId);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = ensureCart(userId);
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> ApiException.notFound("Item không tồn tại"));
        if (!item.getCartId().equals(cart.getId())) throw ApiException.forbidden("Không có quyền");
        cartItemRepository.delete(item);
        return view(userId);
    }

    @Override
    @Transactional
    public void clear(Long userId) {
        cartItemRepository.deleteAllByCartId(ensureCart(userId).getId());
    }

    private Cart ensureCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder().userId(userId).build()));
    }
}
