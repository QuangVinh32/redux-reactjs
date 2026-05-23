package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        Long categoryId,
        String name,
        String slug,
        String shortDescription,
        String description,
        BigDecimal price,
        BigDecimal oldPrice,
        Integer stock,
        String badge,
        String imageUrl
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getCategoryId(), p.getName(), p.getSlug(),
                p.getShortDescription(), p.getDescription(),
                p.getPrice(), p.getOldPrice(),
                p.getStock(),
                p.getBadge() == null ? null : p.getBadge().name(),
                p.getImageUrl()
        );
    }
}
