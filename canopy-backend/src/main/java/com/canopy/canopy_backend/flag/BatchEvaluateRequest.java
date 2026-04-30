package com.canopy.canopy_backend.flag;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class BatchEvaluateRequest {

    private List<String> flagKeys;
    private Map<String, String> context;
}