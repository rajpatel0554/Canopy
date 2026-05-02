package com.canopy.canopy_backend.segment;

import com.canopy.canopy_backend.targeting.RuleOperator;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddSegmentRuleRequest {

    @NotBlank(message = "Attribute is required")
    private String attribute;

    @NotNull(message = "Operator is required")
    private RuleOperator operator;

    @NotBlank(message = "Value is required")
    private String value;
}