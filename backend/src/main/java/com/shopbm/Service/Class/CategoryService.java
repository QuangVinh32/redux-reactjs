package com.shopbm.Service.Class;

import com.shopbm.Model.DTO.CategoryResponse;
import com.shopbm.Repository.CategoryRepository;
import com.shopbm.Service.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {

    private final CategoryRepository repo;

    @Override
    public List<CategoryResponse> listActive() {
        return repo.findAllByActiveTrueOrderByDisplayOrderAsc().stream()
                .map(CategoryResponse::from).toList();
    }
}
