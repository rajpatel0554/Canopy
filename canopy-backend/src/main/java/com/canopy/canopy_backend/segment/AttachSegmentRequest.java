package com.canopy.canopy_backend.segment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AttachSegmentRequest {

    @NotNull(message = "Segment ID is required")
    private UUID segmentId;

    private UUID variationId;  // optional — null means return ON variation
}