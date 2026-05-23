package com.shopbm.Repository;

import com.shopbm.Model.Entity.Order;
import com.shopbm.Model.Enum.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    long countByUserIdAndStatus(Long userId, OrderStatus status);
    long countByUserId(Long userId);
}
