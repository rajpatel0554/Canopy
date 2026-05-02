package com.canopy.canopy_backend.targeting;

import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RuleEvaluator {

    /**
     * Evaluates whether a user context satisfies a single rule.
     *
     * @param context   The user's attribute map — e.g. { "plan": "premium" }
     * @param attribute The rule's attribute key  — e.g. "plan"
     * @param operator  The comparison operator   — e.g. EQUALS
     * @param ruleValue The rule's expected value  — e.g. "premium"
     * @return true if the context matches the rule, false otherwise
     */
    public boolean evaluate(
            Map<String, String> context,
            String attribute,
            RuleOperator operator,
            String ruleValue
    ) {
        // Step 1 — get the actual value from the user's context
        String contextValue = context.get(attribute);

        // Step 2 — if the attribute isn't present at all, no match possible
        if (contextValue == null) {
            return false;
        }

        // Step 3 — normalise both sides to lowercase for case-insensitive comparison
        String actual   = contextValue.toLowerCase();
        String expected = ruleValue.toLowerCase();

        // Step 4 — apply the operator
        return switch (operator) {
            case EQUALS       ->  actual.equals(expected);
            case NOT_EQUALS   -> !actual.equals(expected);
            case CONTAINS     ->  actual.contains(expected);
            case NOT_CONTAINS -> !actual.contains(expected);
            case STARTS_WITH  ->  actual.startsWith(expected);
            case ENDS_WITH    ->  actual.endsWith(expected);
        };
    }
}