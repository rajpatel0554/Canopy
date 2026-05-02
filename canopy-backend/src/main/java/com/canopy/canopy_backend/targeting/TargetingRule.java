package com.canopy.canopy_backend.targeting;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TargetingRule {

    private UUID ruleId;
    private UUID flagId;
    private String attribute;
    private RuleOperator operator;
    private String value;
    private UUID variationId;
    private int priority;
}