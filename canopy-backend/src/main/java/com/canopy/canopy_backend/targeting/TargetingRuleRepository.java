package com.canopy.canopy_backend.targeting;

import com.canopy.canopy_backend.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class TargetingRuleRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── RowMapper ──────────────────────────────────────────────────────────
    // Converts one DB row into one TargetingRule object.
    // variationId can be null in the DB — handled with null check.

    private final RowMapper<TargetingRule> ruleRowMapper = (rs, rowNum) -> {

        String variationIdStr = rs.getString("variation_id");

        return TargetingRule.builder()
                .ruleId(UUID.fromString(rs.getString("rule_id")))
                .flagId(UUID.fromString(rs.getString("flag_id")))
                .attribute(rs.getString("attribute"))
                .operator(RuleOperator.valueOf(rs.getString("operator")))
                .value(rs.getString("value"))
                .variationId(variationIdStr != null
                        ? UUID.fromString(variationIdStr)
                        : null)
                .priority(rs.getInt("priority"))
                .build();
    };

    // ── findByFlagId ───────────────────────────────────────────────────────
    // Returns all rules for a flag, ordered by priority (0 first).

    public List<TargetingRule> findByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".targeting_rules
                WHERE flag_id = ?::uuid
                ORDER BY priority ASC
                """.formatted(schema);
        return jdbcTemplate.query(sql, ruleRowMapper, flagId.toString());
    }

    // ── save ───────────────────────────────────────────────────────────────

    public void save(TargetingRule rule) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                INSERT INTO "%s".targeting_rules
                    (rule_id, flag_id, attribute, operator,
                     value, variation_id, priority)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """.formatted(schema);

        jdbcTemplate.update(sql,
                rule.getRuleId(),
                rule.getFlagId(),
                rule.getAttribute(),
                rule.getOperator().name(),
                rule.getValue(),
                rule.getVariationId(),   // null is fine — JDBC handles it
                rule.getPriority()
        );
    }

    // ── deleteById ─────────────────────────────────────────────────────────

    public void deleteById(UUID ruleId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                DELETE FROM "%s".targeting_rules
                WHERE rule_id = ?::uuid
                """.formatted(schema);
        jdbcTemplate.update(sql, ruleId.toString());
    }

    // ── existsById ─────────────────────────────────────────────────────────
    // Used to verify a rule belongs to the tenant before deleting.

    public boolean existsById(UUID ruleId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT COUNT(*) FROM "%s".targeting_rules
                WHERE rule_id = ?::uuid
                """.formatted(schema);
        Integer count = jdbcTemplate.queryForObject(
                sql, Integer.class, ruleId.toString()
        );
        return count != null && count > 0;
    }
}