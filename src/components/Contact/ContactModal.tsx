"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

// Actually sending an email from a static site needs a live delivery
// service with real credentials — there's no way around that, and
// it's not something that can be provisioned without an account and
// keys from you. This is wired up for EmailJS specifically because it
// sends straight from the browser with no backend/API route needed:
// create a free account at emailjs.com, connect the Gmail you want
// mail to land in, make a template with {{from_name}}, {{from_email}},
// {{message}} variables, then set these three as env vars —
// NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
// NEXT_PUBLIC_EMAILJS_PUBLIC_KEY (the "public key" is meant to be
// public — that's what makes browser-side sending possible; EmailJS's
// own free-tier rate limiting is what keeps it from being abused).
// Without those three set, the form below shows a clear error instead
// of silently pretending to send.
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (!open) return null;

  const configured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!configured) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID!,
        TEMPLATE_ID!,
        { from_name: name, from_email: email, message },
        { publicKey: PUBLIC_KEY! }
      );
      setStatus("sent");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setName("");
        setEmail("");
        setMessage("");
      }, 1400);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-xl italic text-zinc-900">Send a message</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-zinc-400 transition-colors hover:text-zinc-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
          />
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
          />

          {status === "error" && !configured && (
            <p className="text-xs text-red-500">
              This form isn&apos;t wired up to a live email service yet — see
              ContactModal.tsx for the three env vars it needs.
            </p>
          )}
          {status === "error" && configured && (
            <p className="text-xs text-red-500">
              Couldn&apos;t send — please try again, or email directly.
            </p>
          )}
          {status === "sent" && (
            <p className="text-xs text-emerald-600">Sent! Thanks for reaching out.</p>
          )}

          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="w-full rounded-lg bg-linear-to-r from-pink-500 to-amber-400 py-2.5 text-sm text-white transition-all hover:brightness-105 disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
