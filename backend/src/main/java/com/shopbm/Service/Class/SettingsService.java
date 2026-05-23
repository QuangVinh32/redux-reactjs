package com.shopbm.Service.Class;

import com.shopbm.Model.DTO.SettingsResponse;
import com.shopbm.Model.Entity.UserSettings;
import com.shopbm.Model.Request.UpdateSettingsRequest;
import com.shopbm.Repository.UserSettingsRepository;
import com.shopbm.Service.ISettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService implements ISettingsService {

    private final UserSettingsRepository repo;

    @Override
    public SettingsResponse get(Long userId) {
        return SettingsResponse.from(load(userId));
    }

    @Override
    @Transactional
    public SettingsResponse update(Long userId, UpdateSettingsRequest req) {
        UserSettings s = load(userId);
        if (req.theme() != null) s.setTheme(req.theme());
        if (req.language() != null) s.setLanguage(req.language());
        if (req.currency() != null) s.setCurrency(req.currency());
        if (req.fontScale() != null) s.setFontScale(req.fontScale());
        if (req.compactMode() != null) s.setCompactMode(req.compactMode());
        if (req.enableNotifications() != null) s.setEnableNotifications(req.enableNotifications());
        if (req.enableSound() != null) s.setEnableSound(req.enableSound());
        if (req.enableDecorations() != null) s.setEnableDecorations(req.enableDecorations());
        return SettingsResponse.from(repo.save(s));
    }

    @Override
    @Transactional
    public SettingsResponse reset(Long userId) {
        UserSettings s = load(userId);
        UserSettings def = UserSettings.defaults(s.getUserId());
        s.setTheme(def.getTheme());
        s.setLanguage(def.getLanguage());
        s.setCurrency(def.getCurrency());
        s.setFontScale(def.getFontScale());
        s.setCompactMode(def.isCompactMode());
        s.setEnableNotifications(def.isEnableNotifications());
        s.setEnableSound(def.isEnableSound());
        s.setEnableDecorations(def.isEnableDecorations());
        return SettingsResponse.from(repo.save(s));
    }

    private UserSettings load(Long userId) {
        return repo.findById(userId).orElseGet(() -> repo.save(UserSettings.defaults(userId)));
    }
}
