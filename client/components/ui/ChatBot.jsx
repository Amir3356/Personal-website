"use client";

import { useEffect, useRef, useState } from "react";
import { sendChat, hasApiKey } from "@/lib/chat";
import { site } from "@/lib/data";

const GREETING = {
  role: "assistant",
  content: `Hi! Ask me anything about ${site.name}'s work, stack or experience.`,
};

const SUGGESTIONS = [
  "What's his tech stack?",
  "Tell me about his projects",
  "How do I get in touch?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const scroller = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view as the thread grows.
  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Esc closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || busy) return;

    // The full thread goes to the API so the model keeps its context —
    // assistant turns carry reasoning_details back unmodified.
    const next = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setError(null);
    setBusy(true);

    try {
      const reply = await sendChat(next);
      setMessages([
        ...next,
        {
          role: "assistant",
          content: reply.content,
          reasoning_details: reply.reasoning_details,
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages(next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Chat with the assistant"
        aria-expanded={open}
        className={`fixed right-5 bottom-5 z-70 grid h-14 w-14 cursor-pointer place-items-center rounded-full border border-violet-neon/40 bg-violet-neon text-white shadow-[0_0_28px_-6px_var(--color-violet-neon)] transition-all duration-300 sm:right-8 sm:bottom-8 ${
          open ? "pointer-events-none scale-0 opacity-0" : "hover:scale-105 scale-100 opacity-100"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.4-.6L3 21l1.8-4.6A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4Z" />
        </svg>
      </button>

      {/* Panel */}
      <div
        className={`fixed right-5 bottom-5 z-70 flex w-[min(23rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line/70 bg-surface/95 backdrop-blur-md transition-all duration-300 sm:right-8 sm:bottom-8 ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100 scale-100 origin-bottom-right"
            : "pointer-events-none translate-y-4 opacity-0 scale-95 origin-bottom-right"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/70 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-violet-neon/15 text-cyan-neon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <rect x="4" y="7" width="16" height="12" rx="3" />
                <path d="M12 7V4M9 13h.01M15 13h.01" />
              </svg>
            </span>
            <div>
              <p className="font-display text-sm font-bold">Ask about {site.name}</p>
              <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
                AI Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-transparent text-muted transition-colors hover:bg-elevate hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Thread */}
        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto px-5 py-4 max-h-[22rem]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <p
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-violet-neon text-white"
                    : "bg-elevate text-ink/90"
                }`}
              >
                {m.content}
              </p>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <span className="flex gap-1 rounded-2xl bg-elevate px-4 py-3">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-neon [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-neon [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-neon" />
              </span>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-violet-neon/30 bg-violet-neon/10 px-3 py-2 text-xs text-violet-soft">
              {error}
            </p>
          )}

          {/* Starter prompts, only before the first question */}
          {messages.length === 1 && !busy && (
            <div className="flex flex-wrap gap-2 pt-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="cursor-pointer rounded-full border border-line/70 px-3 py-1.5 text-xs text-muted transition-colors hover:border-violet-neon/50 hover:text-ink"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-line/70 p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasApiKey ? "Ask a question…" : "Add an API key to chat"}
            disabled={busy}
            className="w-full rounded-full border border-line/70 bg-void/60 px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-violet-neon/60 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full bg-ink text-void transition-colors hover:bg-violet-neon hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
