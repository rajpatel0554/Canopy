package com.canopy.canopy_backend.flag;

import lombok.Data;

import java.util.Map;

@Data
public class EvaluateRequest {

    // Context is a flexible key-value map of user attributes
    // e.g. { "email": "raj@acme.com", "plan": "premium", "country": "IN" }
    private Map<String, String> context;
}