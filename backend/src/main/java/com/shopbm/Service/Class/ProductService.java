package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.DTO.ProductResponse;
import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Model.Entity.Product;
import com.shopbm.Model.Enum.ProductBadge;
import com.shopbm.Model.Enum.ProductStatus;
import com.shopbm.Model.Request.UpsertProductRequest;
import com.shopbm.Repository.CategoryRepository;
import com.shopbm.Repository.ProductRepository;
import com.shopbm.Service.IFileService;
import com.shopbm.Service.IProductService;
import com.shopbm.Utils.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IFileService fileService;

    @Override
    public PageResponse<ProductResponse> search(Long categoryId, String q, Pageable pageable) {
        return PageResponse.from(productRepository.search(categoryId, q, pageable), ProductResponse::from);
    }

    @Override
    public List<ProductResponse> featured() {
        return productRepository.findTop8ByStatusAndBadgeInOrderByCreatedAtDesc(
                        ProductStatus.ACTIVE, List.of(ProductBadge.HOT, ProductBadge.SALE))
                .stream().map(ProductResponse::from).toList();
    }

    @Override
    public List<ProductResponse> latest() {
        return productRepository.findTop8ByStatusOrderByCreatedAtDesc(ProductStatus.ACTIVE)
                .stream().map(ProductResponse::from).toList();
    }

    @Override
    @Transactional
    public ProductResponse detail(String slug) {
        Product p = productRepository.findBySlug(slug)
                .orElseThrow(() -> ApiException.notFound("Sản phẩm không tồn tại"));
        p.setViewCount(p.getViewCount() + 1);
        return ProductResponse.from(productRepository.save(p));
    }

    @Override
    @Transactional
    public ProductResponse create(UpsertProductRequest req) {
        if (!categoryRepository.existsById(req.categoryId())) {
            throw ApiException.badRequest("Danh mục không tồn tại");
        }
        String slug = (req.slug() == null || req.slug().isBlank())
                ? SlugUtil.toSlug(req.name())
                : SlugUtil.toSlug(req.slug());
        if (productRepository.findBySlug(slug).isPresent()) {
            slug = slug + "-" + System.currentTimeMillis() % 10000;
        }

        Product p = Product.builder()
                .categoryId(req.categoryId())
                .sku(req.sku())
                .name(req.name())
                .slug(slug)
                .shortDescription(req.shortDescription())
                .description(req.description())
                .price(req.price())
                .oldPrice(req.oldPrice())
                .stock(req.stock())
                .badge(req.badge())
                .imageUrl(req.imageUrl())
                .status(req.status() == null ? ProductStatus.ACTIVE : req.status())
                .build();
        return ProductResponse.from(productRepository.save(p));
    }

    @Override
    @Transactional
    public ProductResponse update(Long id, UpsertProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Sản phẩm không tồn tại"));
        if (!categoryRepository.existsById(req.categoryId())) {
            throw ApiException.badRequest("Danh mục không tồn tại");
        }
        p.setCategoryId(req.categoryId());
        if (req.sku() != null) p.setSku(req.sku());
        p.setName(req.name());
        p.setShortDescription(req.shortDescription());
        p.setDescription(req.description());
        p.setPrice(req.price());
        p.setOldPrice(req.oldPrice());
        p.setStock(req.stock());
        p.setBadge(req.badge());
        if (req.imageUrl() != null && !req.imageUrl().equals(p.getImageUrl())) {
            String oldImage = p.getImageUrl();
            p.setImageUrl(req.imageUrl());
            if (oldImage != null) fileService.deleteByUrl(oldImage);
        }
        if (req.status() != null) p.setStatus(req.status());
        if (req.slug() != null && !req.slug().isBlank()) {
            p.setSlug(SlugUtil.toSlug(req.slug()));
        }
        return ProductResponse.from(p);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Sản phẩm không tồn tại"));
        p.setStatus(ProductStatus.ARCHIVED);
        if (p.getImageUrl() != null) fileService.deleteByUrl(p.getImageUrl());
        p.setImageUrl(null);
    }

    @Override
    @Transactional
    public UploadResponse uploadImage(Long id, MultipartFile file) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Sản phẩm không tồn tại"));
        UploadResponse uploaded = fileService.upload(file, "products");
        String oldImage = p.getImageUrl();
        p.setImageUrl(uploaded.url());
        if (oldImage != null) fileService.deleteByUrl(oldImage);
        return uploaded;
    }
}
