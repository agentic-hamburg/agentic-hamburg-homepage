import type { APIRoute } from "astro";
import { getStore } from "@netlify/blobs";

export const prerender = false;

const ADMIN_TOKEN = import.meta.env.ADMIN_TOKEN || "dev-admin";

interface OpenSpaceIdea {
  id: string;
  title: string;
  description: string;
  authorName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const token = cookies.get("admin_token")?.value;
    if (token !== ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { ideaId, action } = body;

    if (!ideaId || !action) {
      return new Response(
        JSON.stringify({ error: "ideaId and action are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!["approve", "reject", "delete"].includes(action)) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const store = getStore("open-space-ideas");

    if (action === "delete") {
      await store.delete(ideaId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const idea = (await store.get(ideaId, {
      type: "json",
    })) as OpenSpaceIdea | null;

    if (!idea) {
      return new Response(JSON.stringify({ error: "Idea not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    idea.status = action === "approve" ? "approved" : "rejected";
    await store.setJSON(ideaId, idea);

    return new Response(JSON.stringify(idea), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to moderate idea:", error);
    return new Response(
      JSON.stringify({ error: "Failed to moderate idea" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
