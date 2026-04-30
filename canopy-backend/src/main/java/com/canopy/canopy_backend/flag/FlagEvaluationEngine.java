package com.canopy.canopy_backend.flag;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class FlagEvaluationEngine {

    private final FlagRepository flagRepository;

    // ── SINGLE EVALUATION ────────────────────────────────────────────────────

    public EvaluateResponse evaluate(String flagKey, Map<String, String> context) {

        // Step 1 — Find the flag in this tenant's schema
        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "No flag found with key: " + flagKey
                ));

        // Step 2 — If flag is disabled, return the default (off) value immediately
        if (!flag.isEnabled()) {
            return buildResponse(flag, resolveDefaultValue(flag.getVariationType()));
        }

        // Step 3 — Flag is enabled
        // Phase D will insert targeting rule checks here
        // Phase D will insert percentage rollout checks here

        // Step 4 — No rules matched (or no rules exist yet) → return the ON value
        return buildResponse(flag, resolveOnValue(flag.getVariationType()));
    }

    // ── HELPERS ──────────────────────────────────────────────────────────────

    // The OFF / default value for each variation type
    private String resolveDefaultValue(VariationType type) {
        return switch (type) {
            case BOOLEAN -> "false";
            case STRING  -> "";
            case NUMBER  -> "0";
            case JSON    -> "{}";
        };
    }

    // The ON value for each variation type
    // Phase D will replace this with actual variation lookup from DB
    private String resolveOnValue(VariationType type) {
        return switch (type) {
            case BOOLEAN -> "true";
            case STRING  -> "";
            case NUMBER  -> "0";
            case JSON    -> "{}";
        };
    }

    // Builds the response object from a flag + resolved value
    private EvaluateResponse buildResponse(Flag flag, String value) {
        return EvaluateResponse.builder()
                .flagKey(flag.getKey())
                .value(value)
                .variationType(flag.getVariationType())
                .enabled(flag.isEnabled())
                .build();
    }
}