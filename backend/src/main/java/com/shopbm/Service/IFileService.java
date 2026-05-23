package com.shopbm.Service;

import com.shopbm.Model.DTO.UploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface IFileService {
    /**
     * Upload 1 file vào subfolder (vd "products", "avatars", "banners").
     * Trả về URL public của file đã lưu.
     */
    UploadResponse upload(MultipartFile file, String subfolder);

    /**
     * Xoá file theo URL đã upload trước đó (nếu file nằm trong upload dir).
     * Bỏ qua nếu URL không thuộc upload dir hoặc file không tồn tại.
     */
    void deleteByUrl(String url);
}
