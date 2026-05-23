package com.shopbm.Service;

import com.shopbm.Model.DTO.AffiliateStatsResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.AffiliateCommission;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;

public interface IAffiliateService {
    void recordCommission(Long referrerId, Long referredId, Long orderId, BigDecimal orderAmount);
    AffiliateStatsResponse statsOf(Long userId);
    PageResponse<AffiliateCommission> commissions(Long userId, Pageable pageable);
}
