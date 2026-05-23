package com.shopbm.Repository;

import com.shopbm.Model.Entity.SeasonalBanner;
import com.shopbm.Model.Enum.Theme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeasonalBannerRepository extends JpaRepository<SeasonalBanner, Long> {
    Optional<SeasonalBanner> findByThemeAndActiveTrue(Theme theme);
}
