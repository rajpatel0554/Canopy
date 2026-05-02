package com.canopy.canopy_backend.flag;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CreateFlagRequest {

    @NotBlank(message = "Flag key is required")
    @Pattern(
            regexp = "^[a-z0-9]+(-[a-z0-9]+)*$",
            message = "Key must be lowercase letters, numbers, and hyphens only (e.g. new-checkout)"
    )
    private String key;

    @NotBlank(message = "Flag name is required")
    private String name;

    private String description;

    @NotNull(message = "Variation type is required")
    private VariationType variationType;

    private int rolloutPercentage = 0;  // optional — defaults to 0
}