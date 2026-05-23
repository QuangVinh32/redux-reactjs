package com.shopbm.Model.Entity;

import com.shopbm.Model.Enum.AffiliateTier;
import com.shopbm.Model.Enum.CommissionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "affiliate_commissions", indexes = {
        @Index(name = "idx_ac_referrer", columnList = "referrer_user_id"),
        @Index(name = "idx_ac_order", columnList = "order_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffiliateCommission extends BaseEntity {

    @Column(name = "referrer_user_id", nullable = false)
    private Long referrerUserId;

    @Column(name = "referred_user_id", nullable = false)
    private Long referredUserId;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "order_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal orderAmount;

    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 2)
    private BigDecimal commissionRate;

    @Column(name = "commission_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal commissionAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "tier_at_time", length = 20)
    private AffiliateTier tierAtTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CommissionStatus status = CommissionStatus.PENDING;

    @Column(name = "transaction_id")
    private Long transactionId;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;
}
