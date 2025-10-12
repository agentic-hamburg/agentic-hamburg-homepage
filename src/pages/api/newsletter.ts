import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse form data
    const formData = await request.formData();
    const email = formData.get("email")?.toString();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get ConvertKit credentials from environment
    const apiKey = import.meta.env.CONVERTKIT_API_KEY;
    const formId = import.meta.env.CONVERTKIT_FORM_ID;

    if (!apiKey || !formId) {
      console.error("ConvertKit configuration missing");
      console.error("API Key exists:", !!apiKey);
      console.error("Form ID exists:", !!formId);
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const convertKitUrl = `https://api.convertkit.com/v3/forms/${formId}/subscribe`;

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("ConvertKit API timeout")), 8000);
    });

    // Make the API request with timeout
    const convertKitResponse = (await Promise.race([
      fetch(convertKitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          email,
        }),
      }),
      timeoutPromise,
    ])) as Response;

    const data = await convertKitResponse.json();

    if (!convertKitResponse.ok) {
      console.error("ConvertKit API error:", data);

      // Handle specific ConvertKit errors
      if (data.error && data.error.includes("already subscribed")) {
        return new Response(
          JSON.stringify({
            message:
              "You're already subscribed! Check your inbox for our latest updates.",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error: data.message || "Failed to subscribe. Please try again.",
        }),
        {
          status: convertKitResponse.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        message: "Successfully subscribed! Check your email for confirmation.",
        subscription: data.subscription,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    if (error instanceof Error && error.message.includes("timeout")) {
      return new Response(
        JSON.stringify({ error: "Request timeout. Please try again." }),
        {
          status: 504,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
