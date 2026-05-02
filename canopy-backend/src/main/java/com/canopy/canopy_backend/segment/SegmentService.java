package com.canopy.canopy_backend.segment;

import com.canopy.canopy_backend.flag.Flag;
import com.canopy.canopy_backend.flag.FlagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SegmentService {

    private final SegmentRepository segmentRepository;
    private final FlagRepository flagRepository;

    // ── Segment CRUD ───────────────────────────────────────────────────────

    public List<Segment> getAllSegments() {
        return segmentRepository.findAll();
    }

    public Segment getSegmentById(UUID segmentId) {
        Segment segment = segmentRepository.findById(segmentId)
                .orElseThrow(() -> new RuntimeException(
                        "Segment not found: " + segmentId
                ));
        // Load rules and attach them to the segment object
        segment.setRules(segmentRepository.findRulesBySegmentId(segmentId));
        return segment;
    }

    public Segment createSegment(CreateSegmentRequest request) {
        Segment segment = Segment.builder()
                .segmentId(UUID.randomUUID())
                .name(request.getName())
                .description(request.getDescription())
                .createdAt(LocalDateTime.now())
                .build();
        segmentRepository.save(segment);
        return segment;
    }

    public void deleteSegment(UUID segmentId) {
        if (!segmentRepository.existsById(segmentId)) {
            throw new RuntimeException("Segment not found: " + segmentId);
        }
        // ON DELETE CASCADE handles segment_rules + flag_segments cleanup
        segmentRepository.deleteById(segmentId);
    }

    // ── Segment Rules ──────────────────────────────────────────────────────

    public SegmentRule addRuleToSegment(UUID segmentId,
                                        AddSegmentRuleRequest request) {
        if (!segmentRepository.existsById(segmentId)) {
            throw new RuntimeException("Segment not found: " + segmentId);
        }

        SegmentRule rule = SegmentRule.builder()
                .ruleId(UUID.randomUUID())
                .segmentId(segmentId)
                .attribute(request.getAttribute())
                .operator(request.getOperator())
                .value(request.getValue())
                .build();

        segmentRepository.saveRule(rule);
        return rule;
    }

    public void removeRuleFromSegment(UUID ruleId) {
        if (!segmentRepository.ruleExistsById(ruleId)) {
            throw new RuntimeException("Segment rule not found: " + ruleId);
        }
        segmentRepository.deleteRuleById(ruleId);
    }

    // ── Flag ↔ Segment Links ───────────────────────────────────────────────

    public void attachSegmentToFlag(String flagKey,
                                    AttachSegmentRequest request) {
        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "Flag not found: " + flagKey
                ));

        if (!segmentRepository.existsById(request.getSegmentId())) {
            throw new RuntimeException(
                    "Segment not found: " + request.getSegmentId()
            );
        }

        if (segmentRepository.isSegmentAttachedToFlag(
                flag.getFlagId(), request.getSegmentId())) {
            throw new RuntimeException(
                    "Segment is already attached to this flag"
            );
        }

        segmentRepository.attachSegmentToFlag(
                flag.getFlagId(),
                request.getSegmentId(),
                request.getVariationId()
        );
    }

    public void detachSegmentFromFlag(String flagKey, UUID segmentId) {
        Flag flag = flagRepository.findByKey(flagKey)
                .orElseThrow(() -> new RuntimeException(
                        "Flag not found: " + flagKey
                ));
        segmentRepository.detachSegmentFromFlag(flag.getFlagId(), segmentId);
    }
}