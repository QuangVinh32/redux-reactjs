package com.shopbm.Service;

import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Model.DTO.UserResponse;
import com.shopbm.Model.DTO.WalletResponse;
import com.shopbm.Model.Entity.User;
import com.shopbm.Model.Request.ChangePasswordRequest;
import com.shopbm.Model.Request.UpdateAvatarRequest;
import com.shopbm.Model.Request.UpdateProfileRequest;
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    UserResponse toResponse(User user);
    WalletResponse walletOf(User user);

    UserResponse updateProfile(Long userId, UpdateProfileRequest req);
    UserResponse setAvatar(Long userId, UpdateAvatarRequest req);
    UploadResponse uploadAvatar(Long userId, MultipartFile file);
    void changePassword(Long userId, ChangePasswordRequest req);
}
