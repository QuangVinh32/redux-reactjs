package com.shopbm.Controller;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.TransactionResponse;
import com.shopbm.Model.Entity.PaymentMethod;
import com.shopbm.Model.Request.RechargeRequest;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.IWalletService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Wallet")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class WalletController {

    private final IWalletService walletService;

    @PostMapping("/wallet/recharges")
    public TransactionResponse recharge(@Valid @RequestBody RechargeRequest req) {
        return walletService.recharge(CurrentUser.getId(), req);
    }

    @GetMapping("/me/transactions")
    public PageResponse<TransactionResponse> myTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return walletService.myTransactions(CurrentUser.getId(),
                PageRequest.of(page, Math.min(size, 100)));
    }

    @GetMapping("/payment-methods")
    public List<PaymentMethod> paymentMethods() {
        return walletService.activePaymentMethods();
    }
}
