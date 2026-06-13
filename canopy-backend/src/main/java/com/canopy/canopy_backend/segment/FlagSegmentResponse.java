package com.canopy.canopy_backend.segment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlagSegmentResponse {
    private UUID segmentId;
    private String name;
    private String description;
    private List<SegmentRule> rules;
    private UUID variationId;
}
