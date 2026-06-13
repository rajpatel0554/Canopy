package com.canopy.canopy_backend.flag;

import com.canopy.canopy_backend.segment.SegmentService;
import com.canopy.canopy_backend.segment.AttachSegmentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/flags")
@RequiredArgsConstructor
public class FlagController {

    private final FlagService flagService;
    private final SegmentService segmentService;

    // ── GET ALL ──────────────────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<FlagResponse>> getAllFlags() {
        List<FlagResponse> flags = flagService.getAllFlags();
        return ResponseEntity.ok(flags);
    }

    // ── GET ONE ──────────────────────────────────────────────────────────────

    @GetMapping("/{key}")
    public ResponseEntity<?> getFlagByKey(@PathVariable String key) {
        try {
            FlagResponse flag = flagService.getFlagByKey(key);
            return ResponseEntity.ok(flag);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> createFlag(
            @Valid @RequestBody CreateFlagRequest request) {
        try {
            FlagResponse flag = flagService.createFlag(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(flag);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    @PutMapping("/{key}")
    public ResponseEntity<?> updateFlag(
            @PathVariable String key,
            @Valid @RequestBody UpdateFlagRequest request) {
        try {
            FlagResponse flag = flagService.updateFlag(key, request);
            return ResponseEntity.ok(flag);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{key}")
    public ResponseEntity<?> deleteFlag(@PathVariable String key) {
        try {
            flagService.deleteFlag(key);
            return ResponseEntity
                    .status(HttpStatus.NO_CONTENT)
                    .build();
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── TOGGLE ───────────────────────────────────────────────────────────────

    @PatchMapping("/{key}/toggle")
    public ResponseEntity<?> toggleFlag(@PathVariable String key) {
        try {
            FlagResponse flag = flagService.toggleFlag(key);
            return ResponseEntity.ok(flag);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    // ── Flag ↔ Segment Relationship Endpoints ───────────────────────────────

    @GetMapping("/{flagKey}/segments")
    public ResponseEntity<?> getAttachedSegments(@PathVariable String flagKey) {
        try {
            return ResponseEntity.ok(segmentService.getAttachedSegmentsForFlag(flagKey));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/{key}/variations")
    public ResponseEntity<?> getVariations(@PathVariable String key) {
        try {
            return ResponseEntity.ok(flagService.getVariations(key));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/{flagKey}/segments")
    public ResponseEntity<?> attachSegment(
            @PathVariable String flagKey,
            @Valid @RequestBody AttachSegmentRequest request
    ) {
        try {
            segmentService.attachSegmentToFlag(flagKey, request);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{flagKey}/segments/{segmentId}")
    public ResponseEntity<?> detachSegment(
            @PathVariable String flagKey,
            @PathVariable UUID segmentId
    ) {
        try {
            segmentService.detachSegmentFromFlag(flagKey, segmentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}