package com.shopbm.Service;

import com.shopbm.Model.DTO.CartResponse;
import com.shopbm.Model.Request.AddToCartRequest;

public interface ICartService {
    CartResponse view(Long userId);
    CartResponse addItem(Long userId, AddToCartRequest req);
    CartResponse removeItem(Long userId, Long itemId);
    void clear(Long userId);
}
