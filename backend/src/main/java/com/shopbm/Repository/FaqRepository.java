package com.shopbm.Repository;

import com.shopbm.Model.Entity.Faq;
import com.shopbm.Model.Enum.FaqCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findAllByActiveTrueOrderByCategoryAscDisplayOrderAsc();
    List<Faq> findAllByActiveTrueAndCategoryOrderByDisplayOrderAsc(FaqCategory category);
}
