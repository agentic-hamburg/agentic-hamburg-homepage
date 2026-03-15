import { defineMiddleware } from "astro:middleware";

const DASHBOARD_TOKEN = import.meta.env.DASHBOARD_TOKEN || "dev-preview";
const ADMIN_TOKEN = import.meta.env.ADMIN_TOKEN || "dev-admin";

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url;

  // Admin routes — separate token
  if (pathname.startsWith("/conf-2026/dashboard/admin")) {
    const token = context.url.searchParams.get("token");

    if (token === ADMIN_TOKEN) {
      context.cookies.set("admin_token", token, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const cookieToken = context.cookies.get("admin_token")?.value;

    if (cookieToken !== ADMIN_TOKEN) {
      return new Response("Not found", { status: 404 });
    }
  }
  // Dashboard routes — attendee token
  else if (pathname.startsWith("/conf-2026/dashboard")) {
    const token = context.url.searchParams.get("token");

    if (token === DASHBOARD_TOKEN) {
      context.cookies.set("dashboard_token", token, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    const cookieToken = context.cookies.get("dashboard_token")?.value;

    if (cookieToken !== DASHBOARD_TOKEN) {
      return new Response("Not found", { status: 404 });
    }
  }

  return next();
});
