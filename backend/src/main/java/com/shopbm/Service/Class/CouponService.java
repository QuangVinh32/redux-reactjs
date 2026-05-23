package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.Entity.Coupon;
import com.shopbm.Model.Entity.CouponUsage;
import com.shopbm.Model.Enum.CouponType;
import com.shopbm.Repository.CouponRepository;
import com.shopbm.Repository.CouponUsageRepository;
import com.shopbm.Service.ICouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CouponService implements ICouponService {

    private final CouponRepository couponRepository;
    private final CouponUsageRepository couponUsageRepository;

    @Override
    public BigDecimal calculateDiscount(String code, BigDecimal subtotal) {
        Coupon c = validate(code, null);
        if (c.getMinOrderAmount() != null && subtotal.compareTo(c.getMinOrderAmount()) < 0) {
            throw ApiException.badRequest("Đơn hàng chưa đạt mức tối thiểu để dùng mã");
        }
        BigDecimal discount;
        if (c.getType() == CouponType.PERCENT) {
            discount = subtotal.multiply(c.getValue()).divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
            if (c.getMaxDiscount() != null && discount.compareTo(c.getMaxDiscount()) > 0) {
                discount = c.getMaxDiscount();
            }
        } else {
            discount = c.getValue();
        }
        return discount.min(subtotal);
    }

    @Override
    @Transactional
    public void consume(Long userId, String code, Long orderId) {
        Coupon c = couponRepository.findWithLockByCode(code)
                .orElseThrow(() -> ApiException.badRequest("Mã giảm giá không tồn tại"));
        if (couponUsageRepository.existsByCouponIdAndUserId(c.getId(), userId)) {
            throw ApiException.badRequest("Bạn đã dùng mã này rồi");
        }
        if (c.getMaxUses() != null && c.getUsedCount() >= c.getMaxUses()) {
            throw ApiException.badRequest("Mã giảm giá đã hết lượt sử dụng");
        }
        c.setUsedCount(c.getUsedCount() + 1);
        couponUsageRepository.save(CouponUsage.builder()
                .couponId(c.getId()).userId(userId).orderId(orderId)
                .usedAt(LocalDateTime.now()).build());
    }

    @Override
    public Coupon validate(String code, Long userId) {
        Coupon c = couponRepository.findByCode(code)
                .orElseThrow(() -> ApiException.badRequest("Mã giảm giá không tồn tại"));
        if (!c.isActive()) throw ApiException.badRequest("Mã đã ngừng sử dụng");
        LocalDateTime now = LocalDateTime.now();
        if (c.getValidFrom() != null && now.isBefore(c.getValidFrom()))
            throw ApiException.badRequest("Mã chưa đến thời gian sử dụng");
        if (c.getValidTo() != null && now.isAfter(c.getValidTo()))
            throw ApiException.badRequest("Mã đã hết hạn");
        if (userId != null && couponUsageRepository.existsByCouponIdAndUserId(c.getId(), userId))
            throw ApiException.badRequest("Bạn đã dùng mã này rồi");
        return c;
    }

    @Override
    public Map<String, Object> validateForUI(String code, Long userId, BigDecimal subtotal) {
        Coupon c = validate(code, userId);
        BigDecimal discount = subtotal == null ? BigDecimal.ZERO : calculateDiscount(code, subtotal);
        return Map.of(
                "code", c.getCode(),
                "type", c.getType().name(),
                "value", c.getValue(),
                "description", c.getDescription() == null ? "" : c.getDescription(),
                "discount", discount
        );
    }
}
