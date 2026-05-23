package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long productId,
        String productName,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal,
        String deliveredContent
) {
    public static OrderItemResponse from(OrderItem oi) {
        return new OrderItemResponse(
                oi.getId(), oi.getProductId(), oi.getProductNameSnapshot(),
                oi.getProductPriceSnapshot(), oi.getQuantity(), oi.getSubtotal(),
                oi.getDeliveredContent()
        );
    }
}
