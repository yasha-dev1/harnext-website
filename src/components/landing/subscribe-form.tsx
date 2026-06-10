"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function SubscribeForm({
  source,
  cta = "Subscribe",
  placeholder = "you@company.com",
  onSuccess,
}: {
  source: "newsletter" | "webinar" | "popup";
  cta?: string;
  placeholder?: string;
  onSuccess?: () => void;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const email = new FormData(e.currentTarget).get("email");
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong — try again.");
      setStatus("ok");
      setMessage(data.message);
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong — try again.");
    }
  }

  if (status === "ok") {
    return <p className="sub-msg ok">✓ {message}</p>;
  }

  return (
    <div className="sub">
      <form className="subform" onSubmit={submit}>
        <input
          name="email"
          type="email"
          required
          placeholder={placeholder}
          aria-label="Email address"
          disabled={status === "loading"}
        />
        <button className="btn btn-amber" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing…" : cta}
        </button>
      </form>
      {status === "error" && <p className="sub-msg err">{message}</p>}
    </div>
  );
}
