package com.shopbm.Model.Request;

import com.shopbm.Model.Enum.ProductBadge;
import com.shopbm.Model.Enum.ProductStatus;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpsertProductRequest(
        @NotNull Long categoryId,
        String sku,
        @NotBlank @Size(max = 200) String name,
        @Size(max = 200) String slug,
        @Size(max = 255) String shortDescription,
        String description,
        @NotNull @DecimalMin("0.0") BigDecimal price,
        @DecimalMin("0.0") BigDecimal oldPrice,
        @NotNull @Min(0) Integer stock,
        ProductBadge badge,
        String imageUrl,
        ProductStatus status
) {}
