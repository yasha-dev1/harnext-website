import { createHash } from "node:crypto";
import { UPCOMING_WEBINAR } from "@/lib/webinars";

const SOURCE_TAGS: Record<string, string[]> = {
  newsletter: ["newsletter"],
  webinar: ["webinar", UPCOMING_WEBINAR.mailchimpTag],
  popup: ["newsletter", "webinar", UPCOMING_WEBINAR.mailchimpTag],
};

export async function POST(request: Request) {
  let email = "";
  let source = "newsletter";
  try {
    const body = await request.json();
    email = String(body.email ?? "").trim();
    source = String(body.source ?? "newsletter");
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  // The datacenter is the API key suffix, e.g. "…-us21"
  const dc = process.env.MAILCHIMP_SERVER_PREFIX ?? apiKey?.split("-").pop();
  if (!apiKey || !audienceId || !dc) {
    return Response.json(
      { error: "Subscriptions aren't live yet — please try again soon." },
      { status: 503 }
    );
  }

  const subscriberHash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const base = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    "Content-Type": "application/json",
  };
  const doubleOptIn = process.env.MAILCHIMP_DOUBLE_OPT_IN === "true";

  // PUT is idempotent: creates the member, or no-ops if they already exist
  const res = await fetch(`${base}/members/${subscriberHash}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      email_address: email,
      status_if_new: doubleOptIn ? "pending" : "subscribed",
    }),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    console.error("Mailchimp error", res.status, detail);
    return Response.json(
      {
        error:
          detail?.title === "Invalid Resource"
            ? "That email address doesn't look right."
            : "Subscription failed — please try again.",
      },
      { status: 502 }
    );
  }

  const tags = SOURCE_TAGS[source] ?? SOURCE_TAGS.newsletter;
  await fetch(`${base}/members/${subscriberHash}/tags`, {
    method: "POST",
    headers,
    body: JSON.stringify({ tags: tags.map((name) => ({ name, status: "active" })) }),
  }).catch(() => {});

  return Response.json({
    message: doubleOptIn
      ? "Almost there — check your inbox to confirm."
      : "You're in — watch your inbox for the details.",
  });
}
