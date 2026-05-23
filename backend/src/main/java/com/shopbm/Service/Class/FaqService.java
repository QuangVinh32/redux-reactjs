package com.shopbm.Service.Class;

import com.shopbm.Model.Entity.Faq;
import com.shopbm.Model.Enum.FaqCategory;
import com.shopbm.Repository.FaqRepository;
import com.shopbm.Service.IFaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FaqService implements IFaqService {

    private final FaqRepository repo;

    @Override
    public List<Faq> list(FaqCategory category) {
        return category == null
                ? repo.findAllByActiveTrueOrderByCategoryAscDisplayOrderAsc()
                : repo.findAllByActiveTrueAndCategoryOrderByDisplayOrderAsc(category);
    }
}
