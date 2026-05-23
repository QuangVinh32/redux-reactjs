package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.PageResponse;
import com.shopbm.Model.Entity.Notification;
import com.shopbm.Model.Enum.NotificationType;
import com.shopbm.Repository.NotificationRepository;
import com.shopbm.Service.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {

    private final NotificationRepository repo;

    @Override
    @Transactional
    public Notification create(Long userId, NotificationType type, String title, String body) {
        return repo.save(Notification.builder()
                .userId(userId).type(type).title(title).body(body).build());
    }

    @Override
    public PageResponse<Notification> list(Long userId, Pageable pageable) {
        return PageResponse.from(repo.findAllByUserIdOrderByCreatedAtDesc(userId, pageable));
    }

    @Override
    public long unreadCount(Long userId) {
        return repo.countByUserIdAndReadAtIsNull(userId);
    }

    @Override
    @Transactional
    public Notification markRead(Long userId, Long id) {
        Notification n = repo.findById(id)
                .orElseThrow(() -> ApiException.notFound("Thông báo không tồn tại"));
        if (!n.getUserId().equals(userId)) throw ApiException.forbidden("Không có quyền");
        if (n.getReadAt() == null) n.setReadAt(LocalDateTime.now());
        return n;
    }

    @Override
    @Transactional
    public int markAllRead(Long userId) {
        return repo.markAllAsRead(userId, LocalDateTime.now());
    }
}
