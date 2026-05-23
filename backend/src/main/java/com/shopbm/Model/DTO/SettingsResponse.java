package com.shopbm.Model.DTO;

import com.shopbm.Model.Entity.UserSettings;
import com.shopbm.Model.Enum.*;

public record SettingsResponse(
        Theme theme,
        Language language,
        Currency currency,
        FontScale fontScale,
        boolean compactMode,
        boolean enableNotifications,
        boolean enableSound,
        boolean enableDecorations
) {
    public static SettingsResponse from(UserSettings s) {
        return new SettingsResponse(
                s.getTheme(), s.getLanguage(), s.getCurrency(), s.getFontScale(),
                s.isCompactMode(), s.isEnableNotifications(), s.isEnableSound(), s.isEnableDecorations()
        );
    }
}
