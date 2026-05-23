package com.shopbm.Repository;

import com.shopbm.Model.Entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Page<BlogPost> findAllByPublishedTrueOrderByPublishedAtDesc(Pageable pageable);
    Optional<BlogPost> findBySlugAndPublishedTrue(String slug);
}
