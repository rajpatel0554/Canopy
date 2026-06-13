// ─────────────────────────────────────────────
// Canopy — Global TypeScript Type Definitions
// These match exactly what the Spring Boot backend returns.
// ─────────────────────────────────────────────

// The four variation types a flag can hold
export type VariationType = "BOOLEAN" | "STRING" | "NUMBER" | "JSON";

// The six comparison operators for targeting rules
export type RuleOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "STARTS_WITH"
  | "ENDS_WITH";

// ──────────────
// Tenant
// ──────────────
export interface Tenant {
  tenantId: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ──────────────
// User / Auth
// ──────────────
export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  tenantId: string;
}

// What Auth.js stores in the session
export interface SessionUser {
  token: string;
  email: string;
  role: string;
  tenantId: string;
}

// ──────────────
// Feature Flag
// ──────────────
export interface Flag {
  flagId: string;
  key: string;
  name: string;
  description: string | null;
  variationType: VariationType;
  enabled: boolean;
  rolloutPercentage: number;
  createdAt: string;
}

export interface CreateFlagPayload {
  key: string;
  name: string;
  description?: string;
  variationType: VariationType;
  rolloutPercentage?: number;
}

export interface UpdateFlagPayload {
  name?: string;
  description?: string;
  rolloutPercentage?: number;
}

// ──────────────
// Flag Variation
// ──────────────
export interface FlagVariation {
  variationId: string;
  flagId: string;
  value: string;
  isDefault: boolean;
}

// ──────────────
// Evaluate
// ──────────────
export interface EvaluateRequest {
  context: Record<string, string>;
}

export interface EvaluateResponse {
  value: string;
  variationType: VariationType;
  enabled: boolean;
}

// ──────────────
// Targeting Rule
// ──────────────
export interface TargetingRule {
  ruleId: string;
  flagId: string;
  attribute: string;
  operator: RuleOperator;
  value: string;
  variationId: string;
  priority: number;
}

export interface CreateRulePayload {
  attribute: string;
  operator: RuleOperator;
  value: string;
  variationId: string;
  priority: number;
}

// ──────────────
// Segment
// ──────────────
export interface SegmentRule {
  ruleId: string;
  segmentId: string;
  attribute: string;
  operator: RuleOperator;
  value: string;
}

export interface Segment {
  segmentId: string;
  name: string;
  description: string | null;
  rules: SegmentRule[];
  createdAt: string;
}

export interface CreateSegmentPayload {
  name: string;
  description?: string;
}

export interface AddSegmentRulePayload {
  attribute: string;
  operator: RuleOperator;
  value: string;
}

export interface FlagSegment {
  segmentId: string;
  name: string;
  description: string | null;
  rules: SegmentRule[];
  variationId: string | null;
}

export interface AttachSegmentRequest {
  segmentId: string;
  variationId?: string | null;
}