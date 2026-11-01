const success = "You're on the list! We'll email you when ticket sales open.";

export async function handleLumaSignup(request: Request, apiKey?: string) {
  const reply = (message: string, status = 200) =>
    new Response(JSON.stringify({ message }), {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });

  if (request.method !== "POST") return reply("Method not allowed.", 405);
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return reply("Please submit the form from our website.", 403);
  }
  if (
    !request.headers
      .get("content-type")
      ?.startsWith("application/x-www-form-urlencoded")
  ) {
    return reply("Invalid form submission.", 415);
  }

  try {
    // Bound the body before parsing or forwarding anything to Luma.
    const reader = request.body?.getReader();
    if (!reader) return reply("Please enter your email address.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) {
        await reader.cancel();
        return reply("Form submission is too large.", 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    const data = new URLSearchParams(new TextDecoder().decode(bytes));
    if (data.get("website")) return reply(success);
    const email = data.get("email")?.trim();
    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return reply("Please enter a valid email address.", 400);
    }
    if (data.get("consent") !== "yes") {
      return reply("Please agree to receive email updates.", 400);
    }
    if (!apiKey)
      return reply(
        "Sign-up is temporarily unavailable. Please try again later.",
        503
      );

    const response = await fetch(
      "https://public-api.luma.com/v1/calendars/contacts/import",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-luma-api-key": apiKey,
        },
        body: JSON.stringify({ contacts: [{ email }], tags: ["conf-2027"] }),
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) {
      // Never return provider responses or log addresses/credentials.
      return reply(
        "We couldn't save your sign-up. Please try again later.",
        response.status === 429 ? 429 : 502
      );
    }
    return reply(success);
  } catch {
    return reply("We couldn't save your sign-up. Please try again later.", 502);
  }
}
