package com.shopbm.Service;

import com.shopbm.Model.DTO.CategoryResponse;

import java.util.List;

public interface ICategoryService {
    List<CategoryResponse> listActive();
}
