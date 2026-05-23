package com.shopbm.Service;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.ProductResponse;
import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Model.Request.UpsertProductRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IProductService {
    PageResponse<ProductResponse> search(Long categoryId, String q, Pageable pageable);
    List<ProductResponse> featured();
    List<ProductResponse> latest();
    ProductResponse detail(String slug);

    // Admin operations
    ProductResponse create(UpsertProductRequest req);
    ProductResponse update(Long id, UpsertProductRequest req);
    void delete(Long id);
    UploadResponse uploadImage(Long id, MultipartFile file);
}
