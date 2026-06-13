package com.canopy.canopy_backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Tenant slug is required")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Tenant slug must be lowercase alphanumeric and hyphens only")
    private String tenantSlug;
}