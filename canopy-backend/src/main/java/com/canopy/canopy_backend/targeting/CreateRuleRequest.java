package com.canopy.canopy_backend.targeting;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateRuleRequest {

    @NotBlank(message = "Attribute is required")
    private String attribute;

    @NotNull(message = "Operator is required")
    private RuleOperator operator;

    @NotBlank(message = "Value is required")
    private String value;

    private UUID variationId;   // optional — null means return ON variation

    @Min(value = 0, message = "Priority must be 0 or greater")
    private int priority = 0;
}