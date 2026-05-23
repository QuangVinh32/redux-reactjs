package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.Category;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String icon,
        String description,
        Integer productCount
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getSlug(), c.getIcon(),
                c.getDescription(), c.getProductCount());
    }
}
