package com.shopbm.Model.Entity;

import com.shopbm.Model.Enum.Theme;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "seasonal_banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonalBanner extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Theme theme;

    @Column(name = "banner_text", nullable = false, length = 200)
    private String bannerText;

    @Column(name = "gradient_classes", length = 200)
    private String gradientClasses;

    @Column(length = 500)
    private String emojis;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(nullable = false)
    private boolean active = true;
}
