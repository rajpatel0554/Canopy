package com.canopy.canopy_backend.flag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flags")
@RequiredArgsConstructor
public class FlagController {

    private final FlagService flagService;

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
}