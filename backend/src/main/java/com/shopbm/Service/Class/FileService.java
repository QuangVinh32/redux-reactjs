package com.shopbm.Service.Class;

import com.shopbm.Exception.ApiException;
import com.shopbm.Model.DTO.UploadResponse;
import com.shopbm.Service.IFileService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
public class FileService implements IFileService {

    private final Path uploadRoot;
    private final String baseUrl;
    private final long maxSize;
    private final Set<String> allowedTypes;
    private final Set<String> allowedSubfolders = Set.of("products", "avatars", "banners", "blog", "general");

    public FileService(
            @Value("${app.upload.dir}") String uploadDir,
            @Value("${app.upload.base-url}") String baseUrl,
            @Value("${app.upload.max-size-bytes}") long maxSize,
            @Value("${app.upload.allowed-content-types}") String allowedContentTypes
    ) {
        this.uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.maxSize = maxSize;
        this.allowedTypes = Set.copyOf(Arrays.asList(allowedContentTypes.split(",")));
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadRoot);
            for (String sub : allowedSubfolders) {
                Files.createDirectories(uploadRoot.resolve(sub));
            }
            log.info("📁 Upload directory ready at {}", uploadRoot);
        } catch (IOException e) {
            throw new RuntimeException("Không khởi tạo được thư mục upload: " + uploadRoot, e);
        }
    }

    @Override
    public UploadResponse upload(MultipartFile file, String subfolder) {
        validate(file);
        String safeSub = (subfolder == null || subfolder.isBlank()) ? "general" : subfolder.trim().toLowerCase();
        if (!allowedSubfolders.contains(safeSub)) {
            throw ApiException.badRequest("Subfolder không hợp lệ. Cho phép: " + allowedSubfolders);
        }

        String originalName = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String ext = getExtension(originalName);
        String storedName = UUID.randomUUID().toString().replace("-", "") + (ext.isEmpty() ? "" : "." + ext);

        Path targetDir = uploadRoot.resolve(safeSub);
        Path target = targetDir.resolve(storedName).normalize();
        if (!target.startsWith(uploadRoot)) {
            throw ApiException.badRequest("Đường dẫn không hợp lệ");
        }

        try {
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi ghi file: " + e.getMessage(), e);
        }

        String url = baseUrl + "/" + safeSub + "/" + storedName;
        log.debug("Uploaded {} -> {}", originalName, url);
        return new UploadResponse(url, storedName, file.getContentType(), file.getSize(), safeSub);
    }

    @Override
    public void deleteByUrl(String url) {
        if (url == null || !url.startsWith(baseUrl)) return;
        String relative = url.substring(baseUrl.length());
        if (relative.startsWith("/")) relative = relative.substring(1);
        Path target = uploadRoot.resolve(relative).normalize();
        if (!target.startsWith(uploadRoot)) return;
        try {
            Files.deleteIfExists(target);
        } catch (IOException e) {
            log.warn("Không xoá được file {}: {}", target, e.getMessage());
        }
    }

    private void validate(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("File rỗng");
        }
        if (file.getSize() > maxSize) {
            throw ApiException.badRequest("File vượt quá " + (maxSize / 1024 / 1024) + " MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw ApiException.badRequest("Định dạng file không hỗ trợ. Cho phép: " + allowedTypes);
        }
    }

    private String getExtension(String filename) {
        int idx = filename.lastIndexOf('.');
        if (idx < 0 || idx == filename.length() - 1) return "";
        String ext = filename.substring(idx + 1).toLowerCase();
        // chỉ cho phép alphanum
        return ext.matches("[a-z0-9]{1,8}") ? ext : "";
    }
}
