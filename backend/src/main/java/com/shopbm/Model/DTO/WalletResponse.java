package com.shopbm.Model.DTO;

import java.math.BigDecimal;

public record WalletResponse(BigDecimal balance, BigDecimal discountPercent) {}
