package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.TransactionResponse;
import com.shopbm.Model.Entity.PaymentMethod;
import com.shopbm.Model.Entity.Transaction;
import com.shopbm.Model.Entity.User;
import com.shopbm.Model.Enum.TransactionMethod;
import com.shopbm.Model.Enum.TransactionStatus;
import com.shopbm.Model.Enum.TransactionType;
import com.shopbm.Model.Request.RechargeRequest;
import com.shopbm.Repository.PaymentMethodRepository;
import com.shopbm.Repository.TransactionRepository;
import com.shopbm.Repository.UserRepository;
import com.shopbm.Service.IWalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService implements IWalletService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Override
    @Transactional
    public TransactionResponse recharge(Long userId, RechargeRequest req) {
        PaymentMethod pm = paymentMethodRepository.findByCode(req.methodCode())
                .orElseThrow(() -> ApiException.badRequest("Phương thức không tồn tại"));
        if (!pm.isActive()) throw ApiException.badRequest("Phương thức đang tạm dừng");
        if (pm.getMinAmount() != null && req.amount().compareTo(pm.getMinAmount()) < 0)
            throw ApiException.badRequest("Số tiền tối thiểu " + pm.getMinAmount());

        User user = userRepository.findWithLockById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));

        BigDecimal bonus = req.amount().multiply(pm.getBonusPercent())
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal net = req.amount().add(bonus);
        BigDecimal before = user.getBalance();
        BigDecimal after = before.add(net);
        user.setBalance(after);

        Transaction tx = Transaction.builder()
                .userId(userId)
                .type(TransactionType.RECHARGE)
                .method(TransactionMethod.valueOf(pm.getCode().toUpperCase()))
                .amount(req.amount())
                .bonusAmount(bonus)
                .netAmount(net)
                .balanceBefore(before)
                .balanceAfter(after)
                .status(TransactionStatus.COMPLETED)
                .referenceCode("RCHG-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .description("Nạp tiền qua " + pm.getName())
                .completedAt(LocalDateTime.now())
                .build();
        return TransactionResponse.from(transactionRepository.save(tx));
    }

    @Override
    public PageResponse<TransactionResponse> myTransactions(Long userId, Pageable pageable) {
        return PageResponse.from(
                transactionRepository.findAllByUserIdOrderByCreatedAtDesc(userId, pageable),
                TransactionResponse::from);
    }

    @Override
    public List<PaymentMethod> activePaymentMethods() {
        return paymentMethodRepository.findAllByActiveTrueOrderByDisplayOrderAsc();
    }
}
