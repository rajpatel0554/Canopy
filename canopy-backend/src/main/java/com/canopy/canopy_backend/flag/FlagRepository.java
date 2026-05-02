package com.canopy.canopy_backend.flag;

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
public class FlagRepository {

    private final JdbcTemplate jdbcTemplate;

    // ── ROW MAPPER ───────────────────────────────────────────────────────────
    // Teaches JdbcTemplate how to turn one DB row into one Flag object

    private final RowMapper<Flag> flagRowMapper = (rs, rowNum) -> Flag.builder()
            .flagId(UUID.fromString(rs.getString("flag_id")))
            .key(rs.getString("key"))
            .name(rs.getString("name"))
            .description(rs.getString("description"))
            .variationType(VariationType.valueOf(rs.getString("variation_type")))
            .enabled(rs.getBoolean("enabled"))
            .rolloutPercentage(rs.getInt("rollout_percentage"))
            .createdAt(rs.getTimestamp("created_at").toLocalDateTime())
            .build();

    // ── HELPER ───────────────────────────────────────────────────────────────
    // Builds the schema-qualified table name for every query

    private String table() {
        return "\"" + TenantContext.getTenantSchema() + "\".flags";
    }

    // ── QUERIES ──────────────────────────────────────────────────────────────

    public List<Flag> findAll() {
        String sql = "SELECT * FROM " + table() + " ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, flagRowMapper);
    }

    public Optional<Flag> findByKey(String key) {
        String sql = "SELECT * FROM " + table() + " WHERE \"key\" = ?";
        List<Flag> results = jdbcTemplate.query(sql, flagRowMapper, key);
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public boolean existsByKey(String key) {
        String sql = "SELECT COUNT(*) FROM " + table() + " WHERE \"key\" = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, key);
        return count != null && count > 0;
    }

    public void save(Flag flag) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
            INSERT INTO "%s".flags
                (flag_id, "key", name, description,
                 variation_type, enabled, rollout_percentage, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """.formatted(schema);

        jdbcTemplate.update(sql,
                flag.getFlagId(),
                flag.getKey(),
                flag.getName(),
                flag.getDescription(),
                flag.getVariationType().name(),
                flag.isEnabled(),
                flag.getRolloutPercentage(),
                flag.getCreatedAt()
        );
    }

    public void update(Flag flag) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
            UPDATE "%s".flags
            SET name               = ?,
                description        = ?,
                rollout_percentage = ?,
                enabled            = ?
            WHERE "key" = ?
            """.formatted(schema);

        jdbcTemplate.update(sql,
                flag.getName(),
                flag.getDescription(),
                flag.getRolloutPercentage(),
                flag.isEnabled(),
                flag.getKey()
        );
    }

    public void deleteByKey(String key) {
        String sql = "DELETE FROM " + table() + " WHERE \"key\" = ?";
        jdbcTemplate.update(sql, key);
    }

    public void toggleEnabled(String key) {
        String sql = "UPDATE " + table() + " SET enabled = NOT enabled WHERE \"key\" = ?";
        jdbcTemplate.update(sql, key);
    }
}