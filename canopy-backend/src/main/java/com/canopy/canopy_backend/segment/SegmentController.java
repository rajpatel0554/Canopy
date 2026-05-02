package com.canopy.canopy_backend.segment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SegmentController {

    private final SegmentService segmentService;

    // ── Segment CRUD ───────────────────────────────────────────────────────

    @GetMapping("/api/segments")
    public ResponseEntity<List<Segment>> getAllSegments() {
        return ResponseEntity.ok(segmentService.getAllSegments());
    }

    @PostMapping("/api/segments")
    public ResponseEntity<?> createSegment(
            @Valid @RequestBody CreateSegmentRequest request
    ) {
        try {
            Segment segment = segmentService.createSegment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(segment);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/api/segments/{segmentId}")
    public ResponseEntity<?> getSegment(@PathVariable UUID segmentId) {
        try {
            return ResponseEntity.ok(segmentService.getSegmentById(segmentId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/api/segments/{segmentId}")
    public ResponseEntity<?> deleteSegment(@PathVariable UUID segmentId) {
        try {
            segmentService.deleteSegment(segmentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── Segment Rules ──────────────────────────────────────────────────────

    @PostMapping("/api/segments/{segmentId}/rules")
    public ResponseEntity<?> addRule(
            @PathVariable UUID segmentId,
            @Valid @RequestBody AddSegmentRuleRequest request
    ) {
        try {
            SegmentRule rule = segmentService.addRuleToSegment(
                    segmentId, request
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(rule);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/api/segments/{segmentId}/rules/{ruleId}")
    public ResponseEntity<?> removeRule(
            @PathVariable UUID segmentId,
            @PathVariable UUID ruleId
    ) {
        try {
            segmentService.removeRuleFromSegment(ruleId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── Flag ↔ Segment Links ───────────────────────────────────────────────

    @PostMapping("/api/flags/{flagKey}/segments")
    public ResponseEntity<?> attachSegment(
            @PathVariable String flagKey,
            @Valid @RequestBody AttachSegmentRequest request
    ) {
        try {
            segmentService.attachSegmentToFlag(flagKey, request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/api/flags/{flagKey}/segments/{segmentId}")
    public ResponseEntity<?> detachSegment(
            @PathVariable String flagKey,
            @PathVariable UUID segmentId
    ) {
        try {
            segmentService.detachSegmentFromFlag(flagKey, segmentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}