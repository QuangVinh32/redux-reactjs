package com.shopbm.Service;

import com.shopbm.Model.DTO.OrderResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Request.CreateOrderRequest;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface IOrderService {
    OrderResponse checkout(Long userId, CreateOrderRequest req);
    OrderResponse get(Long userId, Long orderId);
    PageResponse<OrderResponse> myOrders(Long userId, Pageable pageable);
    Map<String, Long> myStats(Long userId);
}
