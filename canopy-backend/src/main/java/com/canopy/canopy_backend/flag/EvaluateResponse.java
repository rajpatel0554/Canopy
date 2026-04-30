package com.canopy.canopy_backend.flag;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluateResponse {

    private String flagKey;
    private String value;             // the resolved variation value
    private VariationType variationType;
    private boolean enabled;          // was the flag on or off?
}