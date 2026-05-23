package com.shopbm.Service;

import com.shopbm.Model.DTO.SettingsResponse;
import com.shopbm.Model.Request.UpdateSettingsRequest;

public interface ISettingsService {
    SettingsResponse get(Long userId);
    SettingsResponse update(Long userId, UpdateSettingsRequest req);
    SettingsResponse reset(Long userId);
}
