package com.canopy.canopy_backend.targeting;

import com.canopy.canopy_backend.flag.Flag;
import com.canopy.canopy_backend.flag.FlagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TargetingRuleService {

    private final TargetingRuleRepository ruleRepository;
    private final FlagRepository flagRepository;

    // ── getRulesForFlag ────────────────────────────────────────────────────

    public List<TargetingRule> getRulesForFlag(String flagKey) {

        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "Flag not found: " + flagKey
                ));

        return ruleRepository.findByFlagId(flag.getFlagId());
    }

    // ── addRule ────────────────────────────────────────────────────────────

    public TargetingRule addRule(String flagKey, CreateRuleRequest request) {

        // Verify the flag exists first
        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "Flag not found: " + flagKey
                ));

        TargetingRule rule = TargetingRule.builder()
                .ruleId(UUID.randomUUID())
                .flagId(flag.getFlagId())
                .attribute(request.getAttribute())
                .operator(request.getOperator())
                .value(request.getValue())
                .variationId(request.getVariationId())
                .priority(request.getPriority())
                .build();

        ruleRepository.save(rule);
        return rule;
    }

    // ── deleteRule ─────────────────────────────────────────────────────────

    public void deleteRule(UUID ruleId) {

        if (!ruleRepository.existsById(ruleId)) {
            throw new RuntimeException(
                    "Targeting rule not found: " + ruleId
            );
        }

        ruleRepository.deleteById(ruleId);
    }
}