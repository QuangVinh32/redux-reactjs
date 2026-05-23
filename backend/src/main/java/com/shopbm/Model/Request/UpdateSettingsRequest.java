package com.shopbm.Model.Request;

import com.shopbm.Model.Enum.*;

public record UpdateSettingsRequest(
        Theme theme,
        Language language,
        Currency currency,
        FontScale fontScale,
        Boolean compactMode,
        Boolean enableNotifications,
        Boolean enableSound,
        Boolean enableDecorations
) {}
