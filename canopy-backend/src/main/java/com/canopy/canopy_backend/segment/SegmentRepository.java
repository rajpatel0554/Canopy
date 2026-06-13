package com.canopy.canopy_backend.segment;

import com.canopy.canopy_backend.targeting.RuleOperator;
import com.canopy.canopy_backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class SegmentRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── RowMappers ─────────────────────────────────────────────────────────

    private final RowMapper<Segment> segmentRowMapper = (rs, rowNum) ->
            Segment.builder()
                    .segmentId(UUID.fromString(rs.getString("segment_id")))
                    .name(rs.getString("name"))
                    .description(rs.getString("description"))
                    .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
                    .build();

    private final RowMapper<SegmentRule> segmentRuleRowMapper = (rs, rowNum) ->
            SegmentRule.builder()
                    .ruleId(UUID.fromString(rs.getString("rule_id")))
                    .segmentId(UUID.fromString(rs.getString("segment_id")))
                    .attribute(rs.getString("attribute"))
                    .operator(RuleOperator.valueOf(rs.getString("operator")))
                    .value(rs.getString("value"))
                    .build();

    // ── Segment CRUD ───────────────────────────────────────────────────────

    public List<Segment> findAll() {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".segments
                ORDER BY created_at DESC
                """.formatted(schema);
        return jdbcTemplate.query(sql, segmentRowMapper);
    }

    public Optional<Segment> findById(UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".segments
                WHERE segment_id = ?::uuid
                """.formatted(schema);
        List<Segment> results = jdbcTemplate.query(
                sql, segmentRowMapper, segmentId.toString()
        );
        return results.isEmpty()
                ? Optional.empty()
                : Optional.of(results.get(0));
    }

    public void save(Segment segment) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                INSERT INTO "%s".segments
                    (segment_id, name, description, created_at)
                VALUES (?, ?, ?, ?)
                """.formatted(schema);
        jdbcTemplate.update(sql,
                segment.getSegmentId(),
                segment.getName(),
                segment.getDescription(),
                segment.getCreatedAt()
        );
    }

    public void deleteById(UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                DELETE FROM "%s".segments
                WHERE segment_id = ?::uuid
                """.formatted(schema);
        jdbcTemplate.update(sql, segmentId.toString());
    }

    public boolean existsById(UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT COUNT(*) FROM "%s".segments
                WHERE segment_id = ?::uuid
                """.formatted(schema);
        Integer count = jdbcTemplate.queryForObject(
                sql, Integer.class, segmentId.toString()
        );
        return count != null && count > 0;
    }

    // ── Segment Rules ──────────────────────────────────────────────────────

    public List<SegmentRule> findRulesBySegmentId(UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".segment_rules
                WHERE segment_id = ?::uuid
                """.formatted(schema);
        return jdbcTemplate.query(
                sql, segmentRuleRowMapper, segmentId.toString()
        );
    }

    public void saveRule(SegmentRule rule) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                INSERT INTO "%s".segment_rules
                    (rule_id, segment_id, attribute, operator, value)
                VALUES (?, ?::uuid, ?, ?, ?)
                """.formatted(schema);
        jdbcTemplate.update(sql,
                rule.getRuleId(),
                rule.getSegmentId().toString(),
                rule.getAttribute(),
                rule.getOperator().name(),
                rule.getValue()
        );
    }

    public void deleteRuleById(UUID ruleId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                DELETE FROM "%s".segment_rules
                WHERE rule_id = ?::uuid
                """.formatted(schema);
        jdbcTemplate.update(sql, ruleId.toString());
    }

    public boolean ruleExistsById(UUID ruleId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT COUNT(*) FROM "%s".segment_rules
                WHERE rule_id = ?::uuid
                """.formatted(schema);
        Integer count = jdbcTemplate.queryForObject(
                sql, Integer.class, ruleId.toString()
        );
        return count != null && count > 0;
    }

    // ── Flag ↔ Segment Links ───────────────────────────────────────────────

    public void attachSegmentToFlag(UUID flagId, UUID segmentId, UUID variationId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                INSERT INTO "%s".flag_segments
                    (flag_id, segment_id, variation_id)
                VALUES (?::uuid, ?::uuid, ?::uuid)
                """.formatted(schema);
        jdbcTemplate.update(sql,
                flagId.toString(),
                segmentId.toString(),
                variationId != null ? variationId.toString() : null
        );
    }

    public void detachSegmentFromFlag(UUID flagId, UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                DELETE FROM "%s".flag_segments
                WHERE flag_id = ?::uuid AND segment_id = ?::uuid
                """.formatted(schema);
        jdbcTemplate.update(sql,
                flagId.toString(),
                segmentId.toString()
        );
    }

    public boolean isSegmentAttachedToFlag(UUID flagId, UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT COUNT(*) FROM "%s".flag_segments
                WHERE flag_id = ?::uuid AND segment_id = ?::uuid
                """.formatted(schema);
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class,
                flagId.toString(), segmentId.toString()
        );
        return count != null && count > 0;
    }

    // ── Used by evaluation engine ──────────────────────────────────────────
    // Returns all segments attached to a flag, with their rules loaded.

    public List<java.util.Map<String, Object>> findAttachedSegmentsRawByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT s.segment_id, s.name, s.description, fs.variation_id
                FROM "%s".segments s
                JOIN "%s".flag_segments fs ON s.segment_id = fs.segment_id
                WHERE fs.flag_id = ?::uuid
                """.formatted(schema, schema);
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            java.util.Map<String, Object> row = new java.util.HashMap<>();
            row.put("segmentId", rs.getString("segment_id"));
            row.put("name", rs.getString("name"));
            row.put("description", rs.getString("description"));
            row.put("variationId", rs.getString("variation_id"));
            return row;
        }, flagId.toString());
    }

    public List<UUID> findSegmentIdsByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT segment_id FROM "%s".flag_segments
                WHERE flag_id = ?::uuid
                """.formatted(schema);
        return jdbcTemplate.query(
                sql,
                (rs, rowNum) -> UUID.fromString(rs.getString("segment_id")),
                flagId.toString()
        );
    }

    public UUID findVariationIdForFlagSegment(UUID flagId, UUID segmentId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT variation_id FROM "%s".flag_segments
                WHERE flag_id = ?::uuid AND segment_id = ?::uuid
                """.formatted(schema);
        List<String> results = jdbcTemplate.query(
                sql,
                (rs, rowNum) -> rs.getString("variation_id"),
                flagId.toString(),
                segmentId.toString()
        );
        if (results.isEmpty() || results.get(0) == null) return null;
        return UUID.fromString(results.get(0));
    }
}