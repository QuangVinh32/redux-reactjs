package com.shopbm.Model.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 120) String fullName,
        @Email String email,
        @Pattern(regexp = "[0-9]{9,11}|^$") String phone
) {}
