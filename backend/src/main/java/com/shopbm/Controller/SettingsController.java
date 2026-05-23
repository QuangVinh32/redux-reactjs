package com.shopbm.Controller;

import com.shopbm.Model.DTO.SettingsResponse;
import com.shopbm.Model.Request.UpdateSettingsRequest;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.ISettingsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Settings")
@RestController
@RequestMapping("/api/v1/me/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final ISettingsService settingsService;

    @GetMapping
    public SettingsResponse get() {
        return settingsService.get(CurrentUser.getId());
    }

    @PutMapping
    public SettingsResponse update(@RequestBody UpdateSettingsRequest req) {
        return settingsService.update(CurrentUser.getId(), req);
    }

    @PostMapping("/reset")
    public SettingsResponse reset() {
        return settingsService.reset(CurrentUser.getId());
    }
}
