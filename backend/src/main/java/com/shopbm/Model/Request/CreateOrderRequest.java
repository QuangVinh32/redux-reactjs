package com.shopbm.Model.Request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateOrderRequest(
        @NotEmpty List<Line> items,
        String couponCode,
        String note
) {
    public record Line(@NotNull Long productId, @NotNull Integer quantity) {}
}
