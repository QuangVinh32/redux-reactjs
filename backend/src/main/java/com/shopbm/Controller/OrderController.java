package com.shopbm.Controller;

import com.shopbm.Model.DTO.OrderResponse;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Request.CreateOrderRequest;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.IOrderService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Orders")
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;

    @PostMapping("/orders")
    public OrderResponse checkout(@Valid @RequestBody CreateOrderRequest req) {
        return orderService.checkout(CurrentUser.getId(), req);
    }

    @GetMapping("/me/orders")
    public PageResponse<OrderResponse> myOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return orderService.myOrders(CurrentUser.getId(), PageRequest.of(page, Math.min(size, 100)));
    }

    @GetMapping("/me/orders/stats")
    public Map<String, Long> myOrderStats() {
        return orderService.myStats(CurrentUser.getId());
    }

    @GetMapping("/orders/{id}")
    public OrderResponse detail(@PathVariable Long id) {
        return orderService.get(CurrentUser.getId(), id);
    }
}
