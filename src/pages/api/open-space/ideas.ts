import type { APIRoute } from "astro";
import { getStore } from "@netlify/blobs";

export const prerender = false;

const DASHBOARD_TOKEN = import.meta.env.DASHBOARD_TOKEN || "dev-preview";
const ADMIN_TOKEN = import.meta.env.ADMIN_TOKEN || "dev-admin";

interface OpenSpaceIdea {
  id: string;
  title: string;
  description: string;
  authorName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const store = getStore("open-space-ideas");
    const { blobs } = await store.list();

    const showAll = url.searchParams.get("all") === "true";
    const countsOnly = url.searchParams.get("counts") === "true";

    // ?all=true requires admin token
    if (showAll) {
      const adminToken = cookies.get("admin_token")?.value;
      if (adminToken !== ADMIN_TOKEN) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    const allIdeas: OpenSpaceIdea[] = [];
    for (const blob of blobs) {
      const idea = await store.get(blob.key, { type: "json" });
      if (idea) {
        const typed = idea as OpenSpaceIdea;
        // Default status for legacy ideas without a status field
        if (!typed.status) typed.status = "pending";
        allIdeas.push(typed);
      }
    }

    // ?counts=true returns just the counts (no auth required)
    if (countsOnly) {
      const counts = { pending: 0, approved: 0, rejected: 0 };
      allIdeas.forEach(i => { counts[i.status] = (counts[i.status] || 0) + 1; });
      return new Response(JSON.stringify(counts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const ideas = showAll
      ? allIdeas
      : allIdeas.filter(i => i.status === "approved");

    // Sort newest first
    ideas.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return new Response(JSON.stringify(ideas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch ideas:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch ideas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verify dashboard token from cookie
    const token = cookies.get("dashboard_token")?.value;
    if (token !== DASHBOARD_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { title, description, name } = body;

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const id = crypto.randomUUID();
    const idea: OpenSpaceIdea = {
      id,
      title: title.trim(),
      description: description?.trim() || "",
      authorName: name.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const store = getStore("open-space-ideas");
    await store.setJSON(id, idea);

    return new Response(JSON.stringify(idea), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to create idea:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create idea" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
