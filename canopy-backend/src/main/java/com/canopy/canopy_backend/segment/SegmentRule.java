package com.canopy.canopy_backend.segment;

import com.canopy.canopy_backend.targeting.RuleOperator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SegmentRule {

    private UUID ruleId;
    private UUID segmentId;
    private String attribute;
    private RuleOperator operator;
    private String value;
}