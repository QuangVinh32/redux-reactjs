package com.shopbm.Service.Class;

import com.shopbm.Model.Entity.SeasonalBanner;
import com.shopbm.Model.Enum.Theme;
import com.shopbm.Repository.SeasonalBannerRepository;
import com.shopbm.Service.IBannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BannerService implements IBannerService {

    private final SeasonalBannerRepository repo;

    @Override
    public Optional<SeasonalBanner> byTheme(Theme theme) {
        return repo.findByThemeAndActiveTrue(theme);
    }
}
