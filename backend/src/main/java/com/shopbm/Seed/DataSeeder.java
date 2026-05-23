package com.shopbm.Seed;

import com.shopbm.Model.Entity.AffiliateStats;
import com.shopbm.Model.Entity.Cart;
import com.shopbm.Model.Entity.User;
import com.shopbm.Model.Entity.UserSettings;
import com.shopbm.Model.Enum.AffiliateTier;
import com.shopbm.Model.Enum.NotificationType;
import com.shopbm.Model.Enum.UserRole;
import com.shopbm.Repository.AffiliateStatsRepository;
import com.shopbm.Repository.CartRepository;
import com.shopbm.Repository.UserRepository;
import com.shopbm.Repository.UserSettingsRepository;
import com.shopbm.Service.INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final CartRepository cartRepository;
    private final AffiliateStatsRepository affiliateStatsRepository;
    private final INotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner seedUsers() {
        return args -> {
            if (userRepository.existsByUsername("admin")) {
                log.info("Seed users đã tồn tại — bỏ qua.");
                return;
            }

            User admin = userRepository.save(User.builder()
                    .username("admin")
                    .email("admin@shopbm.demo")
                    .phone("0900000001")
                    .passwordHash(passwordEncoder.encode("Admin@123"))
                    .fullName("Administrator")
                    .balance(BigDecimal.ZERO)
                    .discountPercent(BigDecimal.ZERO)
                    .role(UserRole.ADMIN)
                    .refCode("BMADMIN")
                    .build());

            User demo = userRepository.save(User.builder()
                    .username("demo")
                    .email("demo@shopbm.demo")
                    .phone("0987654321")
                    .passwordHash(passwordEncoder.encode("Demo@123"))
                    .fullName("Demo User")
                    .balance(new BigDecimal("250000"))
                    .discountPercent(BigDecimal.ZERO)
                    .role(UserRole.USER)
                    .refCode("BMDEMO1")
                    .build());

            for (User u : new User[]{admin, demo}) {
                userSettingsRepository.save(UserSettings.defaults(u.getId()));
                cartRepository.save(Cart.builder().userId(u.getId()).build());
                affiliateStatsRepository.save(AffiliateStats.builder()
                        .userId(u.getId())
                        .currentTier(AffiliateTier.BRONZE)
                        .build());
            }

            notificationService.create(demo.getId(), NotificationType.SYSTEM,
                    "Chào mừng bạn đến với Shop BM!",
                    "Bạn nhận được 250.000đ chào mừng. Mua sắm ngay nhé!");
            notificationService.create(demo.getId(), NotificationType.PROMOTION,
                    "Khuyến mãi tháng này",
                    "Toàn bộ BM giảm 20% trong tuần này.");

            log.info("✅ Seeded users: admin / Admin@123 và demo / Demo@123 (balance 250K).");
        };
    }
}
