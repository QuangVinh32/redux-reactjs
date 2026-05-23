package com.shopbm.Controller;

import com.shopbm.Model.DTO.AffiliateStatsResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.AffiliateCommission;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.IAffiliateService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Affiliate")
@RestController
@RequestMapping("/api/v1/me/affiliate")
@RequiredArgsConstructor
public class AffiliateController {

    private final IAffiliateService affiliateService;

    @GetMapping("/stats")
    public AffiliateStatsResponse stats() {
        return affiliateService.statsOf(CurrentUser.getId());
    }

    @GetMapping("/commissions")
    public PageResponse<AffiliateCommission> commissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return affiliateService.commissions(CurrentUser.getId(),
                PageRequest.of(page, Math.min(size, 100)));
    }
}
