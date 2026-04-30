package com.canopy.canopy_backend.flag;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlagService {

    private final FlagRepository flagRepository;

    // ── GET ALL ──────────────────────────────────────────────────────────────

    public List<FlagResponse> getAllFlags() {
        return flagRepository.findAll()
                .stream()
                .map(FlagResponse::from)
                .collect(Collectors.toList());
    }

    // ── GET ONE ──────────────────────────────────────────────────────────────

    public FlagResponse getFlagByKey(String key) {
        Flag flag = flagRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException(
                        "No flag found with key: " + key
                ));
        return FlagResponse.from(flag);
    }

    // ── CREATE ───────────────────────────────────────────────────────────────

    public FlagResponse createFlag(CreateFlagRequest request) {

        if (flagRepository.existsByKey(request.getKey())) {
            throw new RuntimeException(
                    "A flag with key '" + request.getKey() + "' already exists."
            );
        }

        Flag flag = Flag.builder()
                .flagId(UUID.randomUUID())
                .key(request.getKey())
                .name(request.getName())
                .description(request.getDescription())
                .variationType(request.getVariationType())
                .enabled(false)                          // ← always starts disabled
                .build();

        flagRepository.save(flag);

        return FlagResponse.from(flag);
    }

    // ── UPDATE ───────────────────────────────────────────────────────────────

    public FlagResponse updateFlag(String key, UpdateFlagRequest request) {

        Flag existing = flagRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException(
                        "No flag found with key: " + key
                ));

        Flag updated = Flag.builder()
                .flagId(existing.getFlagId())
                .key(existing.getKey())
                .name(request.getName())
                .description(request.getDescription())
                .variationType(existing.getVariationType())
                .enabled(existing.isEnabled())
                .createdAt(existing.getCreatedAt())
                .build();

        flagRepository.update(updated);

        return FlagResponse.from(updated);
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    public void deleteFlag(String key) {
        if (!flagRepository.existsByKey(key)) {
            throw new RuntimeException(
                    "No flag found with key: " + key
            );
        }
        flagRepository.deleteByKey(key);
    }

    // ── TOGGLE ───────────────────────────────────────────────────────────────

    public FlagResponse toggleFlag(String key) {
        if (!flagRepository.existsByKey(key)) {
            throw new RuntimeException(
                    "No flag found with key: " + key
            );
        }
        flagRepository.toggleEnabled(key);
        return getFlagByKey(key);                        // ← fetch updated state and return it
    }
}
