package com.shopbm.Repository;

import com.shopbm.Model.Entity.AffiliateStats;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.Optional;

public interface AffiliateStatsRepository extends JpaRepository<AffiliateStats, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<AffiliateStats> findWithLockById(Long userId);
}
