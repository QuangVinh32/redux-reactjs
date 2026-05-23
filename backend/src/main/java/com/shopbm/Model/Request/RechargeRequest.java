package com.shopbm.Model.Request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RechargeRequest(
        @NotBlank String methodCode,
        @NotNull @DecimalMin(value = "10000", message = "Số tiền tối thiểu 10.000đ") BigDecimal amount
) {}
