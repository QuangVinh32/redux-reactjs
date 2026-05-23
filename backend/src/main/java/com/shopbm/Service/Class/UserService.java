package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Model.DTO.UserResponse;
import com.shopbm.Model.DTO.WalletResponse;
import com.shopbm.Model.Entity.User;
import com.shopbm.Model.Request.ChangePasswordRequest;
import com.shopbm.Model.Request.UpdateAvatarRequest;
import com.shopbm.Model.Request.UpdateProfileRequest;
import com.shopbm.Repository.UserRepository;
import com.shopbm.Service.IFileService;
import com.shopbm.Service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final IFileService fileService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse toResponse(User user) {
        return UserResponse.from(user);
    }

    @Override
    public WalletResponse walletOf(User user) {
        return new WalletResponse(user.getBalance(), user.getDiscountPercent());
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));

        if (req.fullName() != null && !req.fullName().isBlank()) {
            user.setFullName(req.fullName().trim());
        }
        if (req.email() != null && !req.email().isBlank() && !req.email().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(req.email())) {
                throw ApiException.conflict("Email đã được sử dụng");
            }
            user.setEmail(req.email().trim());
            user.setEmailVerifiedAt(null);
        }
        if (req.phone() != null && !req.phone().isBlank() && !req.phone().equals(user.getPhone())) {
            if (userRepository.existsByPhone(req.phone())) {
                throw ApiException.conflict("Số điện thoại đã được sử dụng");
            }
            user.setPhone(req.phone().trim());
            user.setPhoneVerifiedAt(null);
        }
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UserResponse setAvatar(Long userId, UpdateAvatarRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));
        String oldUrl = user.getAvatarUrl();
        user.setAvatarUrl(req.avatarUrl());
        if (oldUrl != null && !oldUrl.equals(req.avatarUrl())) {
            fileService.deleteByUrl(oldUrl);
        }
        return UserResponse.from(user);
    }

    @Override
    @Transactional
    public UploadResponse uploadAvatar(Long userId, MultipartFile file) {
        UploadResponse uploaded = fileService.upload(file, "avatars");
        setAvatar(userId, new UpdateAvatarRequest(uploaded.url()));
        return uploaded;
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("User không tồn tại"));
        if (user.getPasswordHash() == null
                || !passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
            throw ApiException.badRequest("Mật khẩu hiện tại không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
    }
}
