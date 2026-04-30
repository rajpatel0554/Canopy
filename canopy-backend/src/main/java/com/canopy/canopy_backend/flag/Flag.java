package com.canopy.canopy_backend.flag;

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
public class Flag {

    private UUID flagId;
    private String key;
    private String name;
    private String description;
    private VariationType variationType;
    private boolean enabled;
    private LocalDateTime createdAt;

    // Loaded separately when needed (e.g. for evaluation)
    private List<FlagVariation> variations;
}