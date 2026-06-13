package com.canopy.canopy_backend.segment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Segment {

    private UUID segmentId;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    // Populated when fetching a single segment — not stored in DB directly
    private List<SegmentRule> rules;
    private int flagsCount;
    private List<LinkedFlag> linkedFlags;
}