package com.shopbm.Model.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_methods")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod extends BaseEntity {

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(length = 20)
    private String icon;

    @Column(name = "bonus_percent", precision = 5, scale = 2)
    private BigDecimal bonusPercent = BigDecimal.ZERO;

    @Column(name = "fee_percent", precision = 5, scale = 2)
    private BigDecimal feePercent = BigDecimal.ZERO;

    @Column(name = "min_amount", precision = 15, scale = 2)
    private BigDecimal minAmount;

    @Column(name = "max_amount", precision = 15, scale = 2)
    private BigDecimal maxAmount;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;
}
