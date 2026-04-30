package com.canopy.canopy_backend.flag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlagResponse {

    private UUID flagId;
    private String key;
    private String name;
    private String description;
    private VariationType variationType;
    private boolean enabled;
    private LocalDateTime createdAt;

    // ── Static factory — converts a Flag model into a FlagResponse DTO ──────
    public static FlagResponse from(Flag flag) {
        return FlagResponse.builder()
                .flagId(flag.getFlagId())
                .key(flag.getKey())
                .name(flag.getName())
                .description(flag.getDescription())
                .variationType(flag.getVariationType())
                .enabled(flag.isEnabled())
                .createdAt(flag.getCreatedAt())
                .build();
    }
}