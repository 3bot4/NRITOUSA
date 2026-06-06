"use client";

import { useState } from "react";
import { site } from "@/lib/site";

const topics = [
  "General inquiry",
  "Feedback",
  "Correction to a guide",
  "Partnership / advertising",
  "Other",
];

// No backend is configured, so the form composes a pre-filled email and opens
// the visitor's mail client. This keeps the site fully static while still
// giving users a clear, working way to reach us.
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(topics[0]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${topic}] Message from ${name || "a reader"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const field =
    "mt-1.5 w-full rounded-xl border border-ink-900/10 bg-white px-4 py-3 text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-semibold text-ink-800">
          Name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-semibold text-ink-800">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={field}
        />
      </div>

      <div>
        <label htmlFor="topic" className="text-sm font-semibold text-ink-800">
          Topic
        </label>
        <select
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={field}
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-semibold text-ink-800">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className={field}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:w-auto"
      >
        Send message
      </button>

      <p className="text-xs leading-relaxed text-ink-400">
        Submitting opens your email app with the message pre-filled. Please do
        not include sensitive financial, tax, legal, or immigration documents.
      </p>
    </form>
  );
}
