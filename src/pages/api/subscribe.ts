import type { APIRoute } from "astro";

// This endpoint needs to be server-rendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get form data
    const data = await request.formData();
    const email = data.get("email");
    const subscribeNewsletter = data.get("subscribe_newsletter") === "true";

    // Validate email
    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if ConvertKit is configured
    const apiKey = import.meta.env.CONVERTKIT_API_KEY;
    const formId = import.meta.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId) {
      console.error("ConvertKit not configured properly");
      return new Response(
        JSON.stringify({ error: "Newsletter service not configured" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Build tags array based on checkbox
    const tags = ["waitlist"];
    if (subscribeNewsletter) {
      tags.push("newsletter");
    }

    // Make request to ConvertKit API
    const convertKitUrl = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;

    const response = await fetch(convertKitUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: apiKey,
        email: email,
        tags: tags,
      }),
    });

    const result = await response.json();

    // Handle ConvertKit response
    if (!response.ok) {
      console.error("ConvertKit API error:", result);

      // Handle specific error cases
      if (
        response.status === 400 &&
        result.error?.includes("already subscribed")
      ) {
        return new Response(
          JSON.stringify({
            error: "This email is already subscribed",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: result.message || "Failed to subscribe",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Successfully joined the waitlist! Please check your email to confirm.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
