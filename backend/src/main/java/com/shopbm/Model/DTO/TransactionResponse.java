package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
        Long id,
        String type,
        String method,
        BigDecimal amount,
        BigDecimal bonusAmount,
        BigDecimal netAmount,
        BigDecimal balanceAfter,
        String status,
        String referenceCode,
        Long orderId,
        String description,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {
    public static TransactionResponse from(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getType().name(),
                t.getMethod() == null ? null : t.getMethod().name(),
                t.getAmount(),
                t.getBonusAmount(),
                t.getNetAmount(),
                t.getBalanceAfter(),
                t.getStatus().name(),
                t.getReferenceCode(),
                t.getOrderId(),
                t.getDescription(),
                t.getCreatedAt(),
                t.getCompletedAt()
        );
    }
}
