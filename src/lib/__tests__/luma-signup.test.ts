import { afterEach, describe, expect, it, vi } from "vitest";
import { handleLumaSignup } from "../luma-signup";

function request(
  fields: Record<string, string> = {
    email: "person@example.com",
    consent: "yes",
  },
  origin = "https://agentic.hamburg"
) {
  return new Request("https://agentic.hamburg/api/conf-2027-signup", {
    method: "POST",
    headers: { origin },
    body: new URLSearchParams(fields),
  });
}
afterEach(() => vi.unstubAllGlobals());
describe("Luma signup", () => {
  it("sends only the email and conference tag to Luma using a server credential", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}"));
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleLumaSignup(request(), "test-key");
    expect(response.status).toBe(200);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://public-api.luma.com/v1/calendars/contacts/import"
    );
    expect(options.headers["x-luma-api-key"]).toBe("test-key");
    expect(JSON.parse(options.body)).toEqual({
      contacts: [{ email: "person@example.com" }],
      tags: ["conf-2027"],
    });
    expect(await response.text()).not.toContain("test-key");
  });
  it.each([
    [{ email: "invalid", consent: "yes" }, 400],
    [{ email: "person@example.com" }, 400],
    [{ email: "person@example.com", consent: "yes", website: "spam" }, 200],
    [{ email: "a".repeat(5000), consent: "yes" }, 413],
  ])(
    "rejects invalid input or quietly drops honeypot submissions",
    async (fields, status) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      expect((await handleLumaSignup(request(fields), "test-key")).status).toBe(
        status
      );
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );
  it("rejects cross-site submissions", async () => {
    expect(
      (
        await handleLumaSignup(
          request(undefined, "https://other.example"),
          "test-key"
        )
      ).status
    ).toBe(403);
  });
  it("fails safely without configured credentials", async () => {
    expect((await handleLumaSignup(request())).status).toBe(503);
  });
  it("does not expose Luma error details or claim success", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("sensitive provider details", { status: 401 })
        )
    );
    const response = await handleLumaSignup(request(), "test-key");
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("sensitive");
  });
  it("handles provider timeouts", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("timeout")));
    expect((await handleLumaSignup(request(), "test-key")).status).toBe(502);
  });
});
