package com.canopy.canopy_backend.segment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LinkedFlag {
    private UUID flagId;
    private String key;
    private String name;
    private boolean enabled;
    private UUID variationId;
    private String variationValue;
}
