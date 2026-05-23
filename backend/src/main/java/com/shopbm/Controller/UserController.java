package com.shopbm.Controller;

import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Model.DTO.UserResponse;
import com.shopbm.Model.DTO.WalletResponse;
import com.shopbm.Model.Request.ChangePasswordRequest;
import com.shopbm.Model.Request.UpdateAvatarRequest;
import com.shopbm.Model.Request.UpdateProfileRequest;
import com.shopbm.Security.CurrentUser;
import com.shopbm.Service.IUserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "User")
@RestController
@RequestMapping("/api/v1/me")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;

    @GetMapping
    public UserResponse me() {
        return userService.toResponse(CurrentUser.get());
    }

    @GetMapping("/wallet")
    public WalletResponse wallet() {
        return userService.walletOf(CurrentUser.get());
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(@Valid @RequestBody UpdateProfileRequest req) {
        return userService.updateProfile(CurrentUser.getId(), req);
    }

    @PutMapping("/avatar")
    public UserResponse setAvatar(@Valid @RequestBody UpdateAvatarRequest req) {
        return userService.setAvatar(CurrentUser.getId(), req);
    }

    @PostMapping(value = "/avatar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UploadResponse uploadAvatar(@RequestParam("file") MultipartFile file) {
        return userService.uploadAvatar(CurrentUser.getId(), file);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest req) {
        userService.changePassword(CurrentUser.getId(), req);
        return ResponseEntity.noContent().build();
    }
}
