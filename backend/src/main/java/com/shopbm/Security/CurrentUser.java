package com.shopbm.Security;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.Entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUser {
    private CurrentUser() {}

    public static User get() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
                : null;
        if (!(principal instanceof User u)) {
            throw ApiException.unauthorized("Yêu cầu đăng nhập");
        }
        return u;
    }

    public static Long getId() {
        return get().getId();
    }
}
