package com.shopbm.Controller;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.Notification;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.INotificationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Notifications")
@RestController
@RequestMapping("/api/v1/me/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final INotificationService notificationService;

    @GetMapping
    public PageResponse<Notification> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return notificationService.list(CurrentUser.getId(),
                PageRequest.of(page, Math.min(size, 100)));
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unread() {
        return Map.of("unread", notificationService.unreadCount(CurrentUser.getId()));
    }

    @PostMapping("/{id}/read")
    public Notification read(@PathVariable Long id) {
        return notificationService.markRead(CurrentUser.getId(), id);
    }

    @PostMapping("/read-all")
    public Map<String, Integer> readAll() {
        return Map.of("updated", notificationService.markAllRead(CurrentUser.getId()));
    }
}
