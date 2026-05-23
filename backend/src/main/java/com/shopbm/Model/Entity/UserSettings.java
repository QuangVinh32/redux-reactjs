package com.shopbm.Model.Entity;

import com.shopbm.Model.Enum.*;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_settings")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Theme theme = Theme.LIGHT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private Language language = Language.VI;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private Currency currency = Currency.VND;

    @Enumerated(EnumType.STRING)
    @Column(name = "font_scale", nullable = false, length = 5)
    private FontScale fontScale = FontScale.MD;

    @Column(name = "compact_mode", nullable = false)
    private boolean compactMode = false;

    @Column(name = "enable_notifications", nullable = false)
    private boolean enableNotifications = true;

    @Column(name = "enable_sound", nullable = false)
    private boolean enableSound = false;

    @Column(name = "enable_decorations", nullable = false)
    private boolean enableDecorations = true;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public static UserSettings defaults(Long userId) {
        UserSettings s = new UserSettings();
        s.setUserId(userId);
        return s;
    }
}
