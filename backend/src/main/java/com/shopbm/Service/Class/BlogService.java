package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.BlogPost;
import com.shopbm.Repository.BlogPostRepository;
import com.shopbm.Service.IBlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlogService implements IBlogService {

    private final BlogPostRepository repo;

    @Override
    public PageResponse<BlogPost> list(Pageable pageable) {
        return PageResponse.from(repo.findAllByPublishedTrueOrderByPublishedAtDesc(pageable));
    }

    @Override
    @Transactional
    public BlogPost detail(String slug) {
        BlogPost bp = repo.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> ApiException.notFound("Bài viết không tồn tại"));
        bp.setViewCount(bp.getViewCount() + 1);
        return bp;
    }
}
