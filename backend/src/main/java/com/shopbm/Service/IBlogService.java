package com.shopbm.Service;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.BlogPost;
import org.springframework.data.domain.Pageable;

public interface IBlogService {
    PageResponse<BlogPost> list(Pageable pageable);
    BlogPost detail(String slug);
}
