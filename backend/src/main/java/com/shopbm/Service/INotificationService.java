package com.shopbm.Service;

import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.Notification;
import com.shopbm.Model.Enum.NotificationType;
import org.springframework.data.domain.Pageable;

public interface INotificationService {
    Notification create(Long userId, NotificationType type, String title, String body);
    PageResponse<Notification> list(Long userId, Pageable pageable);
    long unreadCount(Long userId);
    Notification markRead(Long userId, Long id);
    int markAllRead(Long userId);
}
