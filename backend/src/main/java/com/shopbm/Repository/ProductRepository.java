package com.shopbm.Repository;

import com.shopbm.Model.Entity.Product;
import com.shopbm.Model.Enum.ProductBadge;
import com.shopbm.Model.Enum.ProductStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            WHERE p.status = com.shopbm.Model.Enum.ProductStatus.ACTIVE
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
              AND (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')))
            """)
    Page<Product> search(@Param("categoryId") Long categoryId,
                         @Param("q") String q,
                         Pageable pageable);

    List<Product> findTop8ByStatusAndBadgeInOrderByCreatedAtDesc(ProductStatus status, List<ProductBadge> badges);

    List<Product> findTop8ByStatusOrderByCreatedAtDesc(ProductStatus status);

    Optional<Product> findBySlug(String slug);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Product> findWithLockById(Long id);
}
