package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String phone,
        String fullName,
        String avatarUrl,
        BigDecimal balance,
        BigDecimal discountPercent,
        String role,
        String status,
        String refCode,
        LocalDateTime createdAt
) {
    public static UserResponse from(User u) {
        return new UserResponse(
                u.getId(), u.getUsername(), u.getEmail(), u.getPhone(),
                u.getFullName(), u.getAvatarUrl(), u.getBalance(), u.getDiscountPercent(),
                u.getRole().name(), u.getStatus().name(), u.getRefCode(), u.getCreatedAt()
        );
    }
}
