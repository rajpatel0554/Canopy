package com.canopy.canopy_backend.flag;

import com.canopy.canopy_backend.segment.SegmentRepository;
import com.canopy.canopy_backend.segment.SegmentRule;
import com.canopy.canopy_backend.targeting.RuleEvaluator;
import com.canopy.canopy_backend.targeting.TargetingRule;
import com.canopy.canopy_backend.targeting.TargetingRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FlagEvaluationEngine {

    private final FlagRepository            flagRepository;
    private final FlagVariationRepository   variationRepository;
    private final TargetingRuleRepository   targetingRuleRepository;
    private final SegmentRepository         segmentRepository;
    private final RuleEvaluator             ruleEvaluator;

    /**
     * Evaluates a flag for a given user context.
     * Returns an EvaluateResponse with the resolved value.
     */
    public EvaluateResponse evaluate(String flagKey, Map<String, String> context) {

        // ── Find the flag ──────────────────────────────────────────────────
        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "Flag not found: " + flagKey
                ));

        // ── Step 1: Flag disabled → return default immediately ─────────────
        if (!flag.isEnabled()) {
            return buildResponse(flag, getDefaultValue(flag));
        }

        // ── Step 2: Targeting Rules ────────────────────────────────────────
        // Load rules ordered by priority (0 first).
        // First rule that matches wins — return its variation value.
        List<TargetingRule> rules =
                targetingRuleRepository.findByFlagId(flag.getFlagId());

        for (TargetingRule rule : rules) {
            boolean matches = ruleEvaluator.evaluate(
                    context,
                    rule.getAttribute(),
                    rule.getOperator(),
                    rule.getValue()
            );

            if (matches) {
                String value = resolveVariationValue(
                        flag, rule.getVariationId()
                );
                return buildResponse(flag, value);
            }
        }

        // ── Step 3: Segment Targeting ──────────────────────────────────────
        // Check each segment attached to this flag.
        // For each segment, check if ALL its rules match the context.
        // First segment where user qualifies wins.
        List<UUID> segmentIds =
                segmentRepository.findSegmentIdsByFlagId(flag.getFlagId());

        for (UUID segmentId : segmentIds) {
            List<SegmentRule> segmentRules =
                    segmentRepository.findRulesBySegmentId(segmentId);

            boolean userIsInSegment = isUserInSegment(segmentRules, context);

            if (userIsInSegment) {
                UUID variationId = segmentRepository
                        .findVariationIdForFlagSegment(
                                flag.getFlagId(), segmentId
                        );
                String value = resolveVariationValue(flag, variationId);
                return buildResponse(flag, value);
            }
        }

        // ── Step 4: Percentage Rollout ─────────────────────────────────────
        // Only runs if a userId is present in the context.
        // Hash userId + flagKey into a 0-99 bucket.
        // If bucket < rolloutPercentage → user is in the rollout.
        String userId = context.get("userId");

        if (userId != null && flag.getRolloutPercentage() > 0) {
            int bucket = Math.abs((userId + ":" + flagKey).hashCode()) % 100;

            if (bucket < flag.getRolloutPercentage()) {
                String value = resolveVariationValue(flag, null);
                return buildResponse(flag, value);
            }
        }

        // ── Step 5: Default variation ──────────────────────────────────────
        // Nothing matched — return the default (OFF) variation.
        return buildResponse(flag, getDefaultValue(flag));
    }

    // ── Helper: check if user satisfies ALL rules in a segment ────────────
    // A user is in a segment only if every rule matches.
    // If the segment has no rules, no one qualifies.

    private boolean isUserInSegment(
            List<SegmentRule> segmentRules,
            Map<String, String> context
    ) {
        if (segmentRules.isEmpty()) return false;

        for (SegmentRule rule : segmentRules) {
            boolean matches = ruleEvaluator.evaluate(
                    context,
                    rule.getAttribute(),
                    rule.getOperator(),
                    rule.getValue()
            );
            if (!matches) return false;  // ALL rules must match
        }
        return true;
    }

    // ── Helper: resolve a variation's value string ─────────────────────────
    // If variationId is provided → look it up.
    // If null → return the ON (non-default) variation.

    private String resolveVariationValue(Flag flag, UUID variationId) {
        if (variationId != null) {
            return variationRepository.findById(variationId)
                    .map(FlagVariation::getValue)
                    .orElse(getDefaultValue(flag));
        }
        // No variationId → return the ON variation
        return variationRepository.findNonDefaultByFlagId(flag.getFlagId())
                .map(FlagVariation::getValue)
                .orElse(getDefaultValue(flag));
    }

    // ── Helper: get the default (OFF) variation value ──────────────────────
    // Used for Step 1 (disabled flag) and Step 5 (nothing matched).

    private String getDefaultValue(Flag flag) {
        return variationRepository
                .findDefaultByFlagId(flag.getFlagId())
                .map(FlagVariation::getValue)
                .orElse("false");  // ultimate fallback — should never reach this
    }

    // ── Helper: build the response object ─────────────────────────────────

    private EvaluateResponse buildResponse(Flag flag, String value) {
        return EvaluateResponse.builder()
                .value(value)
                .variationType(flag.getVariationType())
                .enabled(flag.isEnabled())
                .build();
    }
}