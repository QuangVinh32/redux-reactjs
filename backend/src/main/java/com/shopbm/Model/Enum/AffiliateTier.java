package com.shopbm.Model.Enum;

import java.math.BigDecimal;

public enum AffiliateTier {
    BRONZE(new BigDecimal("5"), BigDecimal.ZERO, new BigDecimal("5000000")),
    SILVER(new BigDecimal("8"), new BigDecimal("5000000"), new BigDecimal("20000000")),
    GOLD(new BigDecimal("12"), new BigDecimal("20000000"), new BigDecimal("50000000")),
    DIAMOND(new BigDecimal("15"), new BigDecimal("50000000"), null);

    public final BigDecimal rate;
    public final BigDecimal minRevenue;
    public final BigDecimal maxRevenue;

    AffiliateTier(BigDecimal rate, BigDecimal minRevenue, BigDecimal maxRevenue) {
        this.rate = rate;
        this.minRevenue = minRevenue;
        this.maxRevenue = maxRevenue;
    }

    public static AffiliateTier fromRevenue(BigDecimal totalRevenue) {
        if (totalRevenue == null) return BRONZE;
        if (totalRevenue.compareTo(DIAMOND.minRevenue) >= 0) return DIAMOND;
        if (totalRevenue.compareTo(GOLD.minRevenue) >= 0) return GOLD;
        if (totalRevenue.compareTo(SILVER.minRevenue) >= 0) return SILVER;
        return BRONZE;
    }
}
