package com.shopbm.Service;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.TransactionResponse;
import com.shopbm.Model.Entity.PaymentMethod;
import com.shopbm.Model.Request.RechargeRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IWalletService {
    TransactionResponse recharge(Long userId, RechargeRequest req);
    PageResponse<TransactionResponse> myTransactions(Long userId, Pageable pageable);
    List<PaymentMethod> activePaymentMethods();
}
