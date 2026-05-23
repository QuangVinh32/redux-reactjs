package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.AffiliateStats;

import java.math.BigDecimal;

public record AffiliateStatsResponse(
        Integer totalClicks,
        Integer totalReferrals,
        BigDecimal totalCommissionEarned,
        BigDecimal totalCommissionPaid,
        BigDecimal totalRevenue,
        String currentTier,
        BigDecimal currentRate,
        String refCode,
        String referralLink
) {
    public static AffiliateStatsResponse from(AffiliateStats s, String refCode, String baseUrl) {
        return new AffiliateStatsResponse(
                s.getTotalClicks(),
                s.getTotalReferrals(),
                s.getTotalCommissionEarned(),
                s.getTotalCommissionPaid(),
                s.getTotalRevenue(),
                s.getCurrentTier().name(),
                s.getCurrentTier().rate,
                refCode,
                baseUrl + "/shop/register?ref=" + refCode
        );
    }
}
