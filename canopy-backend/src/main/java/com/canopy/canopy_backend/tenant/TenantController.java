package com.canopy.canopy_backend.tenant;

import com.canopy.canopy_backend.model.Tenant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    // ─── POST /api/tenants ─────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createTenant(@RequestBody CreateTenantRequest request) {
        try {
            Tenant tenant = tenantService.createTenant(request.getName());
            return ResponseEntity
                    .status(HttpStatus.CREATED)       // 201
                    .body(tenant);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)   // 400
                    .body(e.getMessage());
        }
    }

    // ─── GET /api/tenants ──────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Tenant>> getAllTenants() {
        List<Tenant> tenants = tenantService.getAllTenants();
        return ResponseEntity.ok(tenants);            // 200
    }

    // ─── GET /api/tenants/{slug} ───────────────────────────────────────────
    @GetMapping("/{slug}")
    public ResponseEntity<?> getTenantBySlug(@PathVariable String slug) {
        try {
            Tenant tenant = tenantService.getTenantBySlug(slug);
            return ResponseEntity.ok(tenant);         // 200
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)     // 404
                    .body(e.getMessage());
        }
    }
}