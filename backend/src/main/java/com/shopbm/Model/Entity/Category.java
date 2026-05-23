package com.shopbm.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories", indexes = @Index(name = "idx_cat_slug", columnList = "slug", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(name = "parent_id")
    private Long parentId;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(length = 20)
    private String icon;

    @Column(length = 255)
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    @Column(name = "product_count", nullable = false)
    private Integer productCount = 0;

    @Column(nullable = false)
    private boolean active = true;
}
