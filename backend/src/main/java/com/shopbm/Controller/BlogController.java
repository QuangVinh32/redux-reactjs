package com.shopbm.Controller;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.BlogPost;
import com.shopbm.Service.IBlogService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Blog")
@RestController
@RequestMapping("/api/v1/blog")
@RequiredArgsConstructor
public class BlogController {

    private final IBlogService blogService;

    @GetMapping
    public PageResponse<BlogPost> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return blogService.list(PageRequest.of(page, Math.min(size, 50)));
    }

    @GetMapping("/{slug}")
    public BlogPost detail(@PathVariable String slug) {
        return blogService.detail(slug);
    }
}
