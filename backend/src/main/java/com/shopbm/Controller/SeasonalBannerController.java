package com.shopbm.Controller;

import com.shopbm.Model.Entity.SeasonalBanner;
import com.shopbm.Model.Enum.Theme;
import com.shopbm.Service.IBannerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Tag(name = "Seasonal Banners")
@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
public class SeasonalBannerController {

    private final IBannerService bannerService;

    @GetMapping("/{theme}")
    public Optional<SeasonalBanner> getByTheme(@PathVariable Theme theme) {
        return bannerService.byTheme(theme);
    }
}
