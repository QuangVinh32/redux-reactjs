package com.shopbm.Model.Request;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 50) String username,
        @NotBlank @Email String email,
        @NotBlank @Pattern(regexp = "[0-9]{9,11}") String phone,
        @NotBlank @Size(min = 6, max = 100) String password,
        String refCode
) {}
