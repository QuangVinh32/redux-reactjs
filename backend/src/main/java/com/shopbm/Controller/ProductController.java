package com.shopbm.Controller;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.ProductResponse;
import com.shopbm.Service.IProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Products")
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    @GetMapping
    public PageResponse<ProductResponse> list(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        String[] sortParts = sort.split(",");
        Sort s = Sort.by(sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC : Sort.Direction.DESC, sortParts[0]);
        return productService.search(categoryId, q, PageRequest.of(page, Math.min(size, 100), s));
    }

    @GetMapping("/featured")
    public List<ProductResponse> featured() {
        return productService.featured();
    }

    @GetMapping("/latest")
    public List<ProductResponse> latest() {
        return productService.latest();
    }

    @GetMapping("/{slug}")
    public ProductResponse detail(@PathVariable String slug) {
        return productService.detail(slug);
    }
}
