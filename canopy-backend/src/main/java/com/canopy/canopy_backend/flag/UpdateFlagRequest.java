package com.canopy.canopy_backend.flag;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateFlagRequest {

    @NotBlank(message = "Flag name is required")
    private String name;

    private String description;
}