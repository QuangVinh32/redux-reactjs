package com.shopbm.Service;

import com.shopbm.Model.Entity.SeasonalBanner;
import com.shopbm.Model.Enum.Theme;

import java.util.Optional;

public interface IBannerService {
    Optional<SeasonalBanner> byTheme(Theme theme);
}
