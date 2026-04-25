-- Tenants table (shared/public schema)
CREATE TABLE IF NOT EXISTS public.tenants (
                                              tenant_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
    );

-- Users table (shared/public schema)
CREATE TABLE IF NOT EXISTS public.users (
                                            user_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL UNIQUE,
    password    VARCHAR(255),                    -- nullable for OAuth users
    tenant_id   UUID REFERENCES public.tenants(tenant_id),
    role        VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    created_at  TIMESTAMP NOT NULL DEFAULT now()
    );

-- API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
                                               key_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   UUID NOT NULL REFERENCES public.tenants(tenant_id),
    hashed_key  VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
    );