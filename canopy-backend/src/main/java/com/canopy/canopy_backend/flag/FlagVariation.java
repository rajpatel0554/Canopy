package com.canopy.canopy_backend.flag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlagVariation {

    private UUID variationId;
    private UUID flagId;
    private String value;   // Stored as JSONB in DB, treated as String in Java
    private boolean isDefault;
}