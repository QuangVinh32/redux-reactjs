package com.shopbm.Model.DTO;

public record UploadResponse(
        String url,
        String filename,
        String contentType,
        long size,
        String subfolder
) {}
