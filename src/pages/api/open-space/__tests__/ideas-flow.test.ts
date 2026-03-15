/**
 * Integration tests for the Open Space Ideas flow.
 *
 * These tests run against a live `netlify dev` server (default http://localhost:8888).
 * Start the server first:  npm run dev
 *
 * The tests exercise:
 *  1. Submitting an idea (POST /api/open-space/ideas)
 *  2. Verifying it does NOT appear in the public list (pending moderation)
 *  3. Counts endpoint returns correct pending count
 *  4. Admin approves the idea (POST /api/open-space/moderate)
 *  5. Approved idea now appears in the public list
 *  6. Admin rejects another idea and verifies it's hidden
 *  7. Admin deletes an idea
 *  8. Auth checks: ?all=true requires admin, POST requires dashboard token
 */

import { describe, it, expect, afterAll } from "vitest";

const BASE = process.env.TEST_BASE_URL || "http://localhost:8888";

// Tokens must match the server defaults (see middleware.ts / env)
const DASHBOARD_TOKEN = process.env.DASHBOARD_TOKEN || "dev-preview";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "dev-admin";

/** Helper: GET with optional cookies */
async function api(
  path: string,
  opts: { cookies?: Record<string, string> } = {}
) {
  const cookieHeader = opts.cookies
    ? Object.entries(opts.cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    : "";
  return fetch(`${BASE}${path}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    redirect: "manual",
  });
}

/** Helper: POST JSON with optional cookies */
async function apiPost(
  path: string,
  body: unknown,
  opts: { cookies?: Record<string, string> } = {}
) {
  const cookieHeader = opts.cookies
    ? Object.entries(opts.cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join("; ")
    : "";
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

const dashboardCookies = { dashboard_token: DASHBOARD_TOKEN };
const adminCookies = {
  dashboard_token: DASHBOARD_TOKEN,
  admin_token: ADMIN_TOKEN,
};

// Track created ideas for cleanup
const createdIds: string[] = [];

// Clean up test data after all tests
afterAll(async () => {
  for (const id of createdIds) {
    try {
      await apiPost(
        "/api/open-space/moderate",
        { ideaId: id, action: "delete" },
        { cookies: adminCookies }
      );
    } catch {
      // best-effort cleanup
    }
  }
});

describe("Open Space Ideas API", () => {
  // ── Auth checks ─────────────────────────────────────────────

  it("POST /ideas returns 401 without dashboard token", async () => {
    const res = await apiPost("/api/open-space/ideas", {
      name: "Nobody",
      title: "Should fail",
    });
    expect(res.status).toBe(401);
  });

  it("GET /ideas?all=true returns 401 without admin token", async () => {
    const res = await api("/api/open-space/ideas?all=true", {
      cookies: dashboardCookies,
    });
    expect(res.status).toBe(401);
  });

  it("POST /moderate returns 401 without admin token", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: "fake", action: "approve" },
      { cookies: dashboardCookies }
    );
    expect(res.status).toBe(401);
  });

  // ── Submission ──────────────────────────────────────────────

  let ideaA: { id: string; title: string; status: string };
  let ideaB: { id: string; title: string; status: string };

  it("POST /ideas creates a pending idea", async () => {
    const res = await apiPost(
      "/api/open-space/ideas",
      {
        name: "Test Runner",
        title: "Test Idea A",
        description: "First test idea",
      },
      { cookies: dashboardCookies }
    );
    expect(res.status).toBe(201);
    ideaA = await res.json();
    createdIds.push(ideaA.id);

    expect(ideaA.title).toBe("Test Idea A");
    expect(ideaA.status).toBe("pending");
    expect(ideaA).toHaveProperty("id");
    expect(ideaA).toHaveProperty("createdAt");
  });

  it("POST /ideas requires name", async () => {
    const res = await apiPost(
      "/api/open-space/ideas",
      { title: "Missing name" },
      { cookies: dashboardCookies }
    );
    expect(res.status).toBe(400);
  });

  it("POST /ideas requires title", async () => {
    const res = await apiPost(
      "/api/open-space/ideas",
      { name: "Has Name" },
      { cookies: dashboardCookies }
    );
    expect(res.status).toBe(400);
  });

  it("creates a second idea for further tests", async () => {
    const res = await apiPost(
      "/api/open-space/ideas",
      { name: "Test Runner", title: "Test Idea B" },
      { cookies: dashboardCookies }
    );
    expect(res.status).toBe(201);
    ideaB = await res.json();
    createdIds.push(ideaB.id);
  });

  // ── Public list (only approved) ─────────────────────────────

  it("GET /ideas does NOT return pending ideas", async () => {
    const res = await api("/api/open-space/ideas");
    expect(res.status).toBe(200);
    const ideas = await res.json();
    const found = ideas.find(
      (i: { id: string }) =>
        i.id === ideaA.id || i.id === ideaB.id
    );
    expect(found).toBeUndefined();
  });

  // ── Counts endpoint ─────────────────────────────────────────

  it("GET /ideas?counts=true returns status counts", async () => {
    const res = await api("/api/open-space/ideas?counts=true");
    expect(res.status).toBe(200);
    const counts = await res.json();
    expect(counts).toHaveProperty("pending");
    expect(counts).toHaveProperty("approved");
    expect(counts).toHaveProperty("rejected");
    expect(counts.pending).toBeGreaterThanOrEqual(2);
  });

  // ── Admin: list all ─────────────────────────────────────────

  it("GET /ideas?all=true with admin token returns all ideas", async () => {
    const res = await api("/api/open-space/ideas?all=true", {
      cookies: adminCookies,
    });
    expect(res.status).toBe(200);
    const ideas = await res.json();
    const ourIds = ideas.map((i: { id: string }) => i.id);
    expect(ourIds).toContain(ideaA.id);
    expect(ourIds).toContain(ideaB.id);
  });

  // ── Moderation: approve ─────────────────────────────────────

  it("POST /moderate approves an idea", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: ideaA.id, action: "approve" },
      { cookies: adminCookies }
    );
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe("approved");
  });

  it("approved idea appears in public list", async () => {
    const res = await api("/api/open-space/ideas");
    const ideas = await res.json();
    const found = ideas.find((i: { id: string }) => i.id === ideaA.id);
    expect(found).toBeDefined();
    expect(found.title).toBe("Test Idea A");
  });

  // ── Moderation: reject ──────────────────────────────────────

  it("POST /moderate rejects an idea", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: ideaB.id, action: "reject" },
      { cookies: adminCookies }
    );
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe("rejected");
  });

  it("rejected idea does NOT appear in public list", async () => {
    const res = await api("/api/open-space/ideas");
    const ideas = await res.json();
    const found = ideas.find((i: { id: string }) => i.id === ideaB.id);
    expect(found).toBeUndefined();
  });

  // ── Moderation: delete ──────────────────────────────────────

  it("POST /moderate deletes an idea", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: ideaA.id, action: "delete" },
      { cookies: adminCookies }
    );
    expect(res.status).toBe(200);
    // Remove from cleanup list since it's already deleted
    const idx = createdIds.indexOf(ideaA.id);
    if (idx !== -1) createdIds.splice(idx, 1);
  });

  it("deleted idea is gone from all lists", async () => {
    const res = await api("/api/open-space/ideas?all=true", {
      cookies: adminCookies,
    });
    const ideas = await res.json();
    const found = ideas.find((i: { id: string }) => i.id === ideaA.id);
    expect(found).toBeUndefined();
  });

  // ── Moderation: validation ──────────────────────────────────

  it("POST /moderate returns 400 for invalid action", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: ideaB.id, action: "invalid" },
      { cookies: adminCookies }
    );
    expect(res.status).toBe(400);
  });

  it("POST /moderate returns 400 for missing fields", async () => {
    const res = await apiPost(
      "/api/open-space/moderate",
      { ideaId: ideaB.id },
      { cookies: adminCookies }
    );
    expect(res.status).toBe(400);
  });
});
