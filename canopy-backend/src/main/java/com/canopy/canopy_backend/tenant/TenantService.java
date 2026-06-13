package com.canopy.canopy_backend.tenant;

import com.canopy.canopy_backend.model.Tenant;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository tenantRepository;
    private final JdbcTemplate jdbcTemplate;

    @Transactional
    public Tenant createTenant(String name) {

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Tenant name cannot be empty.");
        }

        // Step 1 — Generate slug from name
        String slug = generateSlug(name);

        if (slug.isEmpty()) {
            throw new RuntimeException("Invalid tenant name. It must contain letters or numbers.");
        }

        // Step 2 — Check if slug already exists
        if (tenantRepository.existsBySlug(slug)) {
            throw new RuntimeException(
                    "Tenant with slug '" + slug + "' already exists."
            );
        }

        // Step 3 — Save tenant to public.tenants table
        Tenant tenant = Tenant.builder()
                .name(name)
                .slug(slug)
                .build();

        Tenant savedTenant = tenantRepository.save(tenant);

        // Step 4 — Create their private schema + tables
        provisionTenantSchema(slug);

        return savedTenant;
    }

    // ─── Private Helpers ──────────────────────────────────────────────────

    private String generateSlug(String name) {
        return name
                .toLowerCase()           // "Acme Corp" → "acme corp"
                .trim()                  // remove leading/trailing spaces
                .replaceAll("[^a-z0-9\\s-]", "")  // remove special chars
                .replaceAll("\\s+", "-");           // spaces → hyphens
    }

    private void provisionTenantSchema(String slug) {
        String schemaName = "tenant_" + slug;

        // Step 4a — Create the schema
        jdbcTemplate.execute(
                "CREATE SCHEMA IF NOT EXISTS \"" + schemaName + "\""
        );

        // Step 4b — Create all tables inside that schema
        createTenantTables(schemaName);
    }

    private void createTenantTables(String schema) {

        List<String> statements = List.of(

                // flags table
                """
                CREATE TABLE IF NOT EXISTS "%s".flags (
                    flag_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    key             VARCHAR(255) NOT NULL UNIQUE,
                    name            VARCHAR(255) NOT NULL,
                    description     TEXT,
                    variation_type  VARCHAR(50) NOT NULL,
                    enabled         BOOLEAN NOT NULL DEFAULT false,
                    rollout_percentage   INTEGER NOT NULL DEFAULT 0,
                    created_at      TIMESTAMP NOT NULL DEFAULT now()
                )
                """.formatted(schema),

                // flag_variations table
                """
                CREATE TABLE IF NOT EXISTS "%s".flag_variations (
                    variation_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    flag_id         UUID NOT NULL REFERENCES "%s".flags(flag_id)
                                        ON DELETE CASCADE,
                    value           JSONB NOT NULL,
                    is_default      BOOLEAN NOT NULL DEFAULT false
                )
                """.formatted(schema, schema),

                // segments table
                """
                CREATE TABLE IF NOT EXISTS "%s".segments (
                    segment_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    name            VARCHAR(255) NOT NULL,
                    description     TEXT,
                    created_at      TIMESTAMP NOT NULL DEFAULT now()
                )
                """.formatted(schema),

                // targeting_rules table
                """
                CREATE TABLE IF NOT EXISTS "%s".targeting_rules (
                    rule_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    flag_id         UUID NOT NULL REFERENCES "%s".flags(flag_id)
                                        ON DELETE CASCADE,
                    attribute       VARCHAR(255) NOT NULL,
                    operator        VARCHAR(50) NOT NULL,
                    value           VARCHAR(255) NOT NULL,
                    variation_id    UUID REFERENCES "%s".flag_variations(variation_id),
                    priority        INTEGER NOT NULL DEFAULT 0
                )
                """.formatted(schema, schema, schema),

                // ── Table 5: segment_rules (NEW) ────────────────────────────────
                """
                CREATE TABLE IF NOT EXISTS "%s".segment_rules (
                    rule_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    segment_id      UUID NOT NULL REFERENCES "%s".segments(segment_id)
                                        ON DELETE CASCADE,
                    attribute       VARCHAR(255) NOT NULL,
                    operator        VARCHAR(50) NOT NULL,
                    value           VARCHAR(255) NOT NULL
                )
                """.formatted(schema, schema),

                // ── Table 6: flag_segments (NEW) ────────────────────────────────
                """
                CREATE TABLE IF NOT EXISTS "%s".flag_segments (
                    flag_id         UUID NOT NULL REFERENCES "%s".flags(flag_id)
                                        ON DELETE CASCADE,
                    segment_id      UUID NOT NULL REFERENCES "%s".segments(segment_id)
                                        ON DELETE CASCADE,
                    variation_id    UUID REFERENCES "%s".flag_variations(variation_id),
                    PRIMARY KEY (flag_id, segment_id)
                )
                """.formatted(schema, schema, schema, schema)
        );

        // Run each SQL statement one by one
        for (String sql : statements) {
            jdbcTemplate.execute(sql);
        }
    }

    // ─── Other Methods ────────────────────────────────────────────────────

    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    public Tenant getTenantBySlug(String slug) {
        return tenantRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException(
                        "Tenant not found with slug: " + slug
                ));
    }
}