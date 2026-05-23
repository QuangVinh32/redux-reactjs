package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.AuthResponse;
import com.shopbm.Model.Entity.*;
import com.shopbm.Model.Enum.*;
import com.shopbm.Model.Request.LoginRequest;
import com.shopbm.Model.Request.RefreshRequest;
import com.shopbm.Model.Request.RegisterRequest;
import com.shopbm.Repository.*;
import com.shopbm.Security.JwtService;
import com.shopbm.Service.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private static final BigDecimal WELCOME_BONUS = new BigDecimal("50000");

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final AffiliateStatsRepository affiliateStatsRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final CartRepository cartRepository;
    private final TransactionRepository transactionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.username())) throw ApiException.conflict("Tên đăng nhập đã tồn tại");
        if (userRepository.existsByEmail(req.email())) throw ApiException.conflict("Email đã được sử dụng");
        if (userRepository.existsByPhone(req.phone())) throw ApiException.conflict("Số điện thoại đã được sử dụng");

        Long referrerId = null;
        if (req.refCode() != null && !req.refCode().isBlank()) {
            referrerId = userRepository.findByRefCode(req.refCode().trim()).map(User::getId).orElse(null);
        }

        User user = User.builder()
                .username(req.username())
                .email(req.email())
                .phone(req.phone())
                .passwordHash(passwordEncoder.encode(req.password()))
                .fullName(req.username())
                .balance(WELCOME_BONUS)
                .discountPercent(BigDecimal.ZERO)
                .referrerId(referrerId)
                .refCode(generateRefCode())
                .build();
        user = userRepository.save(user);

        userSettingsRepository.save(UserSettings.defaults(user.getId()));
        affiliateStatsRepository.save(AffiliateStats.builder()
                .userId(user.getId())
                .currentTier(AffiliateTier.BRONZE)
                .build());
        cartRepository.save(Cart.builder().userId(user.getId()).build());

        transactionRepository.save(Transaction.builder()
                .userId(user.getId())
                .type(TransactionType.BONUS)
                .method(TransactionMethod.SYSTEM)
                .amount(WELCOME_BONUS)
                .bonusAmount(BigDecimal.ZERO)
                .netAmount(WELCOME_BONUS)
                .balanceBefore(BigDecimal.ZERO)
                .balanceAfter(WELCOME_BONUS)
                .status(TransactionStatus.COMPLETED)
                .description("Tặng 50.000đ chào mừng thành viên mới")
                .completedAt(LocalDateTime.now())
                .build());

        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsernameOrEmail(req.usernameOrEmail(), req.usernameOrEmail())
                .orElseThrow(() -> ApiException.unauthorized("Tài khoản hoặc mật khẩu không đúng"));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Tài khoản hoặc mật khẩu không đúng");
        }
        user.setLastLoginAt(LocalDateTime.now());
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(RefreshRequest req) {
        String hash = JwtService.sha256(req.refreshToken());
        RefreshToken rt = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> ApiException.unauthorized("Refresh token không hợp lệ"));
        if (rt.isRevoked() || rt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw ApiException.unauthorized("Refresh token đã hết hạn");
        }
        rt.setLastUsedAt(LocalDateTime.now());

        User user = userRepository.findById(rt.getUserId())
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));
        return buildAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteAllByUserId(userId);
    }

    private AuthResponse buildAuthResponse(User user) {
        String access = jwtService.generateAccessToken(user.getId(), user.getUsername(), user.getRole().name());
        String refreshPlain = jwtService.generateRefreshTokenPlain();
        refreshTokenRepository.save(RefreshToken.builder()
                .userId(user.getId())
                .tokenHash(JwtService.sha256(refreshPlain))
                .expiresAt(LocalDateTime.now().plusSeconds(jwtService.getRefreshTokenMillis() / 1000))
                .revoked(false)
                .build());

        return new AuthResponse(
                access, refreshPlain, 3600L,
                new AuthResponse.UserInfo(
                        user.getId(), user.getUsername(), user.getEmail(), user.getFullName(),
                        user.getRole().name(), user.getBalance(), user.getDiscountPercent(), user.getRefCode()
                )
        );
    }

    private String generateRefCode() {
        return "BM" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }
}
