// ─────────────────────────────────────────────
// Canopy — Central API Client
// All calls to the Spring Boot backend go through here.
// Never write fetch() directly in a component.
// ─────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

// ── Core fetch wrapper ───────────────────────────────────────────────────────
// Every API call goes through this one function.
// It automatically:
//   1. Sets Content-Type: application/json
//   2. Attaches the JWT token (if provided)
//   3. Parses the JSON response
//   4. Throws a descriptive error if something goes wrong

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // 204 No Content — DELETE calls return no body
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "An error occurred";
    throw new Error(message);
  }

  return data as T;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
import type { AuthResponse, Tenant } from "@/types";

export const authApi = {
  register: (email: string, password: string, tenantSlug: string) =>
    apiFetch<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, tenantSlug }),
    }),

  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
};

export const tenantsApi = {
  create: (name: string) =>
    apiFetch<Tenant>("/api/tenants", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
};

// ── Feature Flags ─────────────────────────────────────────────────────────────
import type { Flag, CreateFlagPayload, UpdateFlagPayload } from "@/types";

export const flagsApi = {
  getAll: (token: string) =>
    apiFetch<Flag[]>("/api/flags", {}, token),

  getOne: (flagKey: string, token: string) =>
    apiFetch<Flag>(`/api/flags/${flagKey}`, {}, token),

  create: (payload: CreateFlagPayload, token: string) =>
    apiFetch<Flag>("/api/flags", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token),

  update: (flagKey: string, payload: UpdateFlagPayload, token: string) =>
    apiFetch<Flag>(`/api/flags/${flagKey}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }, token),

  toggle: (flagKey: string, token: string) =>
    apiFetch<Flag>(`/api/flags/${flagKey}/toggle`, {
      method: "PATCH",
    }, token),

  delete: (flagKey: string, token: string) =>
    apiFetch<void>(`/api/flags/${flagKey}`, {
      method: "DELETE",
    }, token),
};

// ── Targeting Rules ───────────────────────────────────────────────────────────
import type { TargetingRule, CreateRulePayload } from "@/types";

export const rulesApi = {
  getAll: (flagKey: string, token: string) =>
    apiFetch<TargetingRule[]>(`/api/flags/${flagKey}/rules`, {}, token),

  create: (flagKey: string, payload: CreateRulePayload, token: string) =>
    apiFetch<TargetingRule>(`/api/flags/${flagKey}/rules`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, token),

  delete: (flagKey: string, ruleId: string, token: string) =>
    apiFetch<void>(`/api/flags/${flagKey}/rules/${ruleId}`, {
      method: "DELETE",
    }, token),
};

// ── Segments ──────────────────────────────────────────────────────────────────
import type {
  Segment,
  CreateSegmentPayload,
  AddSegmentRulePayload,
} from "@/types";

export const segmentsApi = {
  getAll: (token: string) =>
    apiFetch<Segment[]>("/api/segments", {}, token),

  getOne: (segmentId: string, token: string) =>
    apiFetch<Segment>(`/api/segments/${segmentId}`, {}, token),

  create: (payload: CreateSegmentPayload, token: string) =>
    apiFetch<Segment>("/api/segments", {
      method: "POST",
      body: JSON.stringify(payload),
    }, token),

  delete: (segmentId: string, token: string) =>
    apiFetch<void>(`/api/segments/${segmentId}`, {
      method: "DELETE",
    }, token),

  addRule: (segmentId: string, payload: AddSegmentRulePayload, token: string) =>
    apiFetch<void>(`/api/segments/${segmentId}/rules`, {
      method: "POST",
      body: JSON.stringify(payload),
    }, token),

  deleteRule: (segmentId: string, ruleId: string, token: string) =>
    apiFetch<void>(`/api/segments/${segmentId}/rules/${ruleId}`, {
      method: "DELETE",
    }, token),

  attachToFlag: (flagKey: string, segmentId: string, token: string) =>
    apiFetch<void>(`/api/flags/${flagKey}/segments`, {
      method: "POST",
      body: JSON.stringify({ segmentId }),
    }, token),

  detachFromFlag: (flagKey: string, segmentId: string, token: string) =>
    apiFetch<void>(`/api/flags/${flagKey}/segments/${segmentId}`, {
      method: "DELETE",
    }, token),
};