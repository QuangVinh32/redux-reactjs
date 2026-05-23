package com.shopbm.Model.DTO;

import java.math.BigDecimal;

public record CartItemResponse(
        Long id,
        Long productId,
        String productName,
        String productImage,
        BigDecimal price,
        Integer quantity,
        BigDecimal subtotal
) {}
