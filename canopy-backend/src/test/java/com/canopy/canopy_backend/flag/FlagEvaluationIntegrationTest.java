package com.canopy.canopy_backend.flag;

import com.canopy.canopy_backend.model.Tenant;
import com.canopy.canopy_backend.segment.*;
import com.canopy.canopy_backend.targeting.RuleOperator;
import com.canopy.canopy_backend.tenant.TenantContext;
import com.canopy.canopy_backend.tenant.TenantService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FlagEvaluationIntegrationTest {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private FlagService flagService;

    @Autowired
    private SegmentService segmentService;

    @Autowired
    private FlagEvaluationEngine evaluationEngine;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String tenantSlug;
    private String schemaName;

    @BeforeEach
    void setUp() {
        // Create unique tenant slug
        String name = "Test Org " + UUID.randomUUID().toString().substring(0, 8);
        Tenant tenant = tenantService.createTenant(name);
        tenantSlug = tenant.getSlug();
        schemaName = "tenant_" + tenantSlug;
        TenantContext.setTenantSchema(schemaName);
    }

    @AfterEach
    void tearDown() {
        // Clean up schema
        jdbcTemplate.execute("DROP SCHEMA IF EXISTS \"" + schemaName + "\" CASCADE");
        jdbcTemplate.update("DELETE FROM public.tenants WHERE slug = ?", tenantSlug);
        TenantContext.clear();
    }

    @Test
    void testSegmentTargetingEvaluation() {
        // 1. Create a multivariate BOOLEAN feature flag
        CreateFlagRequest flagRequest = new CreateFlagRequest();
        flagRequest.setKey("beta-feature");
        flagRequest.setName("Beta Feature Flag");
        flagRequest.setVariationType(VariationType.BOOLEAN);
        flagRequest.setRolloutPercentage(0);

        FlagResponse flag = flagService.createFlag(flagRequest);
        assertNotNull(flag);

        // Fetch variations created automatically by default for BOOLEAN (true/false)
        List<FlagVariation> variations = flagService.getVariations(flag.getKey());
        assertFalse(variations.isEmpty());
        
        UUID trueVariationId = variations.stream()
                .filter(v -> "true".equals(v.getValue()))
                .findFirst()
                .map(FlagVariation::getVariationId)
                .orElseThrow();

        // 2. Create a segment for Beta Testers
        CreateSegmentRequest segmentRequest = new CreateSegmentRequest();
        segmentRequest.setName("Beta User Group");
        segmentRequest.setDescription("Early access beta group");
        Segment segment = segmentService.createSegment(segmentRequest);
        assertNotNull(segment);

        // Add rules to segment: email CONTAINS "@company.com"
        AddSegmentRuleRequest ruleRequest = new AddSegmentRuleRequest();
        ruleRequest.setAttribute("email");
        ruleRequest.setOperator(RuleOperator.CONTAINS);
        ruleRequest.setValue("@company.com");
        segmentService.addRuleToSegment(segment.getSegmentId(), ruleRequest);

        // 3. Attach the segment to our flag and configure it to serve TRUE variation
        AttachSegmentRequest attachRequest = new AttachSegmentRequest();
        attachRequest.setSegmentId(segment.getSegmentId());
        attachRequest.setVariationId(trueVariationId);
        segmentService.attachSegmentToFlag(flag.getKey(), attachRequest);

        // 4. Enable the feature flag
        flagService.toggleFlag(flag.getKey());

        // 5. Evaluate the flag for a user inside the segment
        Map<String, String> contextMatch = new HashMap<>();
        contextMatch.put("userId", "user123");
        contextMatch.put("email", "john@company.com");

        EvaluateResponse responseMatch = evaluationEngine.evaluate(flag.getKey(), contextMatch);
        assertTrue(responseMatch.isEnabled());
        assertEquals("true", responseMatch.getValue());

        // 6. Evaluate the flag for a user outside the segment
        Map<String, String> contextNoMatch = new HashMap<>();
        contextNoMatch.put("userId", "user456");
        contextNoMatch.put("email", "user@gmail.com");

        EvaluateResponse responseNoMatch = evaluationEngine.evaluate(flag.getKey(), contextNoMatch);
        assertTrue(responseNoMatch.isEnabled());
        assertEquals("false", responseNoMatch.getValue()); // Serves default (OFF) variation
    }
}
