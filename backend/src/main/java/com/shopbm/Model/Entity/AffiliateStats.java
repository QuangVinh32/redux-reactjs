package com.shopbm.Model.Entity;

import com.shopbm.Model.Enum.AffiliateTier;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "affiliate_stats")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffiliateStats {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "total_clicks", nullable = false)
    private Integer totalClicks = 0;

    @Column(name = "total_referrals", nullable = false)
    private Integer totalReferrals = 0;

    @Column(name = "total_commission_earned", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCommissionEarned = BigDecimal.ZERO;

    @Column(name = "total_commission_paid", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCommissionPaid = BigDecimal.ZERO;

    @Column(name = "total_revenue", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_tier", nullable = false, length = 20)
    private AffiliateTier currentTier = AffiliateTier.BRONZE;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
