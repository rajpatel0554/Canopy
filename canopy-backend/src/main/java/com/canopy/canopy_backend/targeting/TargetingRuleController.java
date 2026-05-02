package com.canopy.canopy_backend.targeting;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flags/{flagKey}/rules")
@RequiredArgsConstructor
public class TargetingRuleController {

    private final TargetingRuleService ruleService;

    // ── GET /api/flags/{flagKey}/rules ─────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<TargetingRule>> getRules(
            @PathVariable String flagKey
    ) {
        return ResponseEntity.ok(ruleService.getRulesForFlag(flagKey));
    }

    // ── POST /api/flags/{flagKey}/rules ────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> addRule(
            @PathVariable String flagKey,
            @Valid @RequestBody CreateRuleRequest request
    ) {
        try {
            TargetingRule rule = ruleService.addRule(flagKey, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(rule);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // ── DELETE /api/flags/{flagKey}/rules/{ruleId} ─────────────────────────

    @DeleteMapping("/{ruleId}")
    public ResponseEntity<?> deleteRule(
            @PathVariable String flagKey,
            @PathVariable UUID ruleId
    ) {
        try {
            ruleService.deleteRule(ruleId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}