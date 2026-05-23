package com.shopbm.Repository;

import com.shopbm.Model.Entity.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {}
