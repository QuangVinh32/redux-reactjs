package com.shopbm.Controller;

import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.ICouponService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@Tag(name = "Coupons")
@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final ICouponService couponService;

    @GetMapping("/validate")
    public Map<String, Object> validate(
            @RequestParam String code,
            @RequestParam(required = false) BigDecimal subtotal
    ) {
        return couponService.validateForUI(code, CurrentUser.getId(), subtotal);
    }
}
