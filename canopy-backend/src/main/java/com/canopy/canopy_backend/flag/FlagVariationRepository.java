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
public class FlagVariationRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<FlagVariation> variationRowMapper = (rs, rowNum) ->
            FlagVariation.builder()
                    .variationId(UUID.fromString(rs.getString("variation_id")))
                    .flagId(UUID.fromString(rs.getString("flag_id")))
                    .value(rs.getString("value"))
                    .isDefault(rs.getBoolean("is_default"))
                    .build();

    // Returns all variations for a flag
    public List<FlagVariation> findByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".flag_variations
                WHERE flag_id = ?::uuid
                """.formatted(schema);
        return jdbcTemplate.query(sql, variationRowMapper, flagId.toString());
    }

    // Returns a specific variation by its ID
    public Optional<FlagVariation> findById(UUID variationId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".flag_variations
                WHERE variation_id = ?::uuid
                """.formatted(schema);
        List<FlagVariation> results = jdbcTemplate.query(
                sql, variationRowMapper, variationId.toString()
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    // Returns the default variation for a flag (is_default = true)
    public Optional<FlagVariation> findDefaultByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".flag_variations
                WHERE flag_id = ?::uuid
                  AND is_default = true
                """.formatted(schema);
        List<FlagVariation> results = jdbcTemplate.query(
                sql, variationRowMapper, flagId.toString()
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    // Returns the non-default variation (the ON variation)
    public Optional<FlagVariation> findNonDefaultByFlagId(UUID flagId) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                SELECT * FROM "%s".flag_variations
                WHERE flag_id = ?::uuid
                  AND is_default = false
                LIMIT 1
                """.formatted(schema);
        List<FlagVariation> results = jdbcTemplate.query(
                sql, variationRowMapper, flagId.toString()
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void save(FlagVariation variation) {
        String schema = TenantContext.getTenantSchema();
        String sql = """
                INSERT INTO "%s".flag_variations
                    (variation_id, flag_id, value, is_default)
                VALUES (?::uuid, ?::uuid, ?::jsonb, ?)
                """.formatted(schema);
        jdbcTemplate.update(sql,
                variation.getVariationId().toString(),
                variation.getFlagId().toString(),
                variation.getValue(),
                variation.isDefault()
        );
    }
}