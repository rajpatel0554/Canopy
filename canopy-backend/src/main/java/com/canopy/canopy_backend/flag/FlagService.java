package com.canopy.canopy_backend.flag;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FlagService {

    private final FlagRepository flagRepository;
    private final FlagVariationRepository variationRepository;

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
                .enabled(false)                             // ← always starts disabled
                .rolloutPercentage(request.getRolloutPercentage())
                .createdAt(LocalDateTime.now())
                .build();

        flagRepository.save(flag);

        // ── Save ON variation (is_default = false) ─────────────────────────
        String onValue = switch (flag.getVariationType()) {
            case BOOLEAN -> "true";
            case STRING  -> "\"on\"";
            case NUMBER  -> "1";
            case JSON    -> "{}";
        };

        FlagVariation onVariation = FlagVariation.builder()
                .variationId(UUID.randomUUID())
                .flagId(flag.getFlagId())
                .value(onValue)
                .isDefault(false)
                .build();

        // ── Save OFF / default variation (is_default = true) ───────────────
        String offValue = switch (flag.getVariationType()) {
            case BOOLEAN -> "false";
            case STRING  -> "\"off\"";
            case NUMBER  -> "0";
            case JSON    -> "{}";
        };

        FlagVariation offVariation = FlagVariation.builder()
                .variationId(UUID.randomUUID())
                .flagId(flag.getFlagId())
                .value(offValue)
                .isDefault(true)
                .build();

        variationRepository.save(onVariation);
        variationRepository.save(offVariation);

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
                .rolloutPercentage(request.getRolloutPercentage())
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

    public List<FlagVariation> getVariations(String key) {
        Flag flag = flagRepository.findByKey(key)
                .orElseThrow(() -> new RuntimeException("Flag not found: " + key));
        return variationRepository.findByFlagId(flag.getFlagId());
    }
}
