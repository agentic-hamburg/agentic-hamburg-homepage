import type { APIRoute } from "astro";
import { handleLumaSignup } from "../../lib/luma-signup";

export const prerender = false;

// Runtime environment only: the key is never bundled into the client or build.
export const POST: APIRoute = ({ request }) =>
  handleLumaSignup(request, process.env.LUMA_API_KEY);
