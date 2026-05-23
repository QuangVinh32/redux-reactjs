package com.shopbm.Controller;

import com.shopbm.Model.DTO.CartResponse;
import com.shopbm.Model.Request.AddToCartRequest;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.ICartService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Cart")
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @GetMapping
    public CartResponse view() {
        return cartService.view(CurrentUser.getId());
    }

    @PostMapping("/items")
    public CartResponse add(@Valid @RequestBody AddToCartRequest req) {
        return cartService.addItem(CurrentUser.getId(), req);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse remove(@PathVariable Long itemId) {
        return cartService.removeItem(CurrentUser.getId(), itemId);
    }

    @DeleteMapping
    public void clear() {
        cartService.clear(CurrentUser.getId());
    }
}
