package com.shopbm.Repository;

import com.shopbm.Model.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByActiveTrueOrderByDisplayOrderAsc();
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
