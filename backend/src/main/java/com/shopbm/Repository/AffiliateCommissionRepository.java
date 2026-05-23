package com.shopbm.Repository;

import com.shopbm.Model.Entity.AffiliateCommission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AffiliateCommissionRepository extends JpaRepository<AffiliateCommission, Long> {
    Page<AffiliateCommission> findAllByReferrerUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
