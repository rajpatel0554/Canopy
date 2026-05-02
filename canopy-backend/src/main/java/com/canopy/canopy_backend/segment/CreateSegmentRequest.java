package com.canopy.canopy_backend.segment;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSegmentRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;
}