package com.canopy.canopy_backend.tenant;

public class TenantContext {

    private static final ThreadLocal<String> currentTenant =
            new ThreadLocal<>();

    public static void setTenantSchema(String schema) {
        currentTenant.set(schema);
    }

    public static String getTenantSchema() {
        return currentTenant.get();
    }

    public static void clear() {
        currentTenant.remove();
    }
}