package com.shopbm.Service;

import com.shopbm.Model.DTO.AuthResponse;
import com.shopbm.Model.Request.LoginRequest;
import com.shopbm.Model.Request.RefreshRequest;
import com.shopbm.Model.Request.RegisterRequest;

public interface IAuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    AuthResponse refresh(RefreshRequest req);
    void logout(Long userId);
}
