package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.AffiliateStatsResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.AffiliateCommission;
import com.shopbm.Model.Entity.AffiliateStats;
import com.shopbm.Model.Enum.AffiliateTier;
import com.shopbm.Model.Enum.CommissionStatus;
import com.shopbm.Repository.AffiliateCommissionRepository;
import com.shopbm.Repository.AffiliateStatsRepository;
import com.shopbm.Repository.UserRepository;
import com.shopbm.Service.IAffiliateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class AffiliateService implements IAffiliateService {

    private final AffiliateStatsRepository statsRepository;
    private final AffiliateCommissionRepository commissionRepository;
    private final UserRepository userRepository;

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String baseUrl;

    @Override
    @Transactional
    public void recordCommission(Long referrerId, Long referredId, Long orderId, BigDecimal orderAmount) {
        AffiliateStats stats = statsRepository.findWithLockById(referrerId)
                .orElseGet(() -> statsRepository.save(AffiliateStats.builder()
                        .userId(referrerId).currentTier(AffiliateTier.BRONZE).build()));

        AffiliateTier tier = stats.getCurrentTier();
        BigDecimal commission = orderAmount.multiply(tier.rate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

        commissionRepository.save(AffiliateCommission.builder()
                .referrerUserId(referrerId)
                .referredUserId(referredId)
                .orderId(orderId)
                .orderAmount(orderAmount)
                .commissionRate(tier.rate)
                .commissionAmount(commission)
                .tierAtTime(tier)
                .status(CommissionStatus.PENDING)
                .build());

        stats.setTotalRevenue(stats.getTotalRevenue().add(orderAmount));
        stats.setTotalCommissionEarned(stats.getTotalCommissionEarned().add(commission));
        stats.setCurrentTier(AffiliateTier.fromRevenue(stats.getTotalRevenue()));
    }

    @Override
    public AffiliateStatsResponse statsOf(Long userId) {
        AffiliateStats stats = statsRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("Chưa có thống kê affiliate"));
        String refCode = userRepository.findById(userId).map(u -> u.getRefCode()).orElse("");
        return AffiliateStatsResponse.from(stats, refCode, baseUrl);
    }

    @Override
    public PageResponse<AffiliateCommission> commissions(Long userId, Pageable pageable) {
        return PageResponse.from(commissionRepository.findAllByReferrerUserIdOrderByCreatedAtDesc(userId, pageable));
    }
}
