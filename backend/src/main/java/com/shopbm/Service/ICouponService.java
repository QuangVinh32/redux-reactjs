package com.shopbm.Service;

import com.shopbm.Model.Entity.Coupon;

import java.math.BigDecimal;
import java.util.Map;

public interface ICouponService {
    BigDecimal calculateDiscount(String code, BigDecimal subtotal);
    void consume(Long userId, String code, Long orderId);
    Coupon validate(String code, Long userId);
    Map<String, Object> validateForUI(String code, Long userId, BigDecimal subtotal);
}
