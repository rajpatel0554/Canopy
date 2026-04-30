package com.canopy.canopy_backend.flag;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evaluate")
@RequiredArgsConstructor
public class EvaluateController {

    private final FlagEvaluationEngine evaluationEngine;

    // ── SINGLE ───────────────────────────────────────────────────────────────

    @PostMapping("/{flagKey}")
    public ResponseEntity<?> evaluate(
            @PathVariable String flagKey,
            @RequestBody EvaluateRequest request) {
        try {
            Map<String, String> context =
                    request.getContext() != null ? request.getContext() : Map.of();

            EvaluateResponse response = evaluationEngine.evaluate(flagKey, context);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(404)
                    .body(e.getMessage());
        }
    }

    // ── BATCH ────────────────────────────────────────────────────────────────

    @PostMapping("/batch")
    public ResponseEntity<List<EvaluateResponse>> evaluateBatch(
            @RequestBody BatchEvaluateRequest request) {

        Map<String, String> context =
                request.getContext() != null ? request.getContext() : Map.of();

        List<EvaluateResponse> responses = request.getFlagKeys()
                .stream()
                .map(key -> {
                    try {
                        return evaluationEngine.evaluate(key, context);
                    } catch (RuntimeException e) {
                        // If one flag key is not found, skip it gracefully
                        return EvaluateResponse.builder()
                                .flagKey(key)
                                .value("false")
                                .variationType(VariationType.BOOLEAN)
                                .enabled(false)
                                .build();
                    }
                })
                .toList();

        return ResponseEntity.ok(responses);
    }
}