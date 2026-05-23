package com.shopbm.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carts", indexes = @Index(name = "idx_cart_user", columnList = "user_id", unique = true))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart extends BaseEntity {
    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;
}
