package com.shopbm.Model.DTO;

import java.math.BigDecimal;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        Long expiresInSeconds,
        UserInfo user
) {
    public record UserInfo(
            Long id,
            String username,
            String email,
            String fullName,
            String role,
            BigDecimal balance,
            BigDecimal discountPercent,
            String refCode
    ) {}
}
