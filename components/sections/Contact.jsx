"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/utils/gsap";
import { site } from "@/utils/data";
import { useSettings } from "@/hooks/useSettings";
import { api } from "@/services";
import Toast from "@/components/ui/Toast";

const FIELD =
  "w-full rounded-xl border border-line/70 bg-surface/70 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-colors focus:border-violet-neon/60 focus:bg-elevate";

export default function Contact() {
  const root = useRef(null);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  // `key` remounts the toast so a second submit replays the animation and
  // restarts the 5s countdown instead of reusing the one already on screen.
  const [toast, setToast] = useState(null);
  const settings = useSettings({ contact: { email: site.email } });

  useGSAP(
    () => {
      gsap.from(".contact-field", {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".contact-form", start: "top 85%" },
      });
    },
    { scope: root }
  );

  /**
   * Sends the message to the API so it shows up in the admin dashboard, and
   * falls back to the visitor's mail client if the API can't be reached.
   */
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name").trim();
    const email = data.get("email").trim();
    const phone = (data.get("phone") || "").trim();
    const subject = data.get("subject").trim();
    const message = data.get("message").trim();

    const next = {};
    if (!name) next.name = "Please tell me your name.";
    if (!email) next.email = "Please add an email so I can reply.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That email doesn't look right.";
    // Optional field, so only complain about a number that was actually typed.
    if (phone && !/^\+?[\d\s().-]{6,}$/.test(phone))
      next.phone = "That phone number doesn't look right.";
    if (!message) next.message = "Please write a short message.";

    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setToast(null);
    try {
      await api.sendMessage({ name, email, phone, subject, message });
      setToast({
        key: Date.now(),
        variant: "success",
        title: "Message sent successfully",
        description:
          "Thanks for reaching out — I've received your message and will get back to you soon.",
      });
      form.reset();
    } catch {
      setToast({
        key: Date.now(),
        variant: "error",
        title: "Couldn't send your message",
        description: "Opening your email app instead so your message isn't lost.",
      });
      // Don't lose the visitor's message if the server is down.
      const body = `${message}\n\n— ${name}\n${email}${phone ? `\n${phone}` : ""}`;
      window.location.href = `mailto:${settings.contact.email}?subject=${encodeURIComponent(
        subject || `Portfolio enquiry from ${name}`
      )}&body=${encodeURIComponent(body)}`;
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={root}
      id="contact"
      className="relative overflow-hidden py-28 lg:py-40"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-130 w-130 -translate-x-1/2 rounded-full bg-violet-neon/10 blur-[150px]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-6 lg:px-10">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Contact Us
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-center text-sm leading-relaxed text-muted">
          Have a project in mind or a role to fill? Send a message and I&apos;ll
          get back to you.
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="contact-form mt-12 rounded-2xl border border-line/70 bg-surface/50 p-6 backdrop-blur-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="contact-field">
              <label
                htmlFor="name"
                className="mb-2 block font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className={FIELD}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-violet-soft">{errors.name}</p>
              )}
            </div>

            <div className="contact-field">
              <label
                htmlFor="email"
                className="mb-2 block font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={FIELD}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-violet-soft">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="contact-field">
              <label
                htmlFor="phone"
                className="mb-2 block font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+251 9XX XXX XXX"
                className={FIELD}
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-violet-soft">{errors.phone}</p>
              )}
            </div>

            <div className="contact-field">
              <label
                htmlFor="subject"
                className="mb-2 block font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What's this about?"
                className={FIELD}
              />
            </div>
          </div>

          <div className="contact-field mt-5">
            <label
              htmlFor="message"
              className="mb-2 block font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Tell me about your project…"
              className={`${FIELD} resize-y`}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-violet-soft">{errors.message}</p>
            )}
          </div>

          {/* Sits in the form flow, directly above the submit button, so the
              result appears where the visitor is already looking. */}
          {toast && (
            <div className="mt-6">
              <Toast
                key={toast.key}
                open
                title={toast.title}
                description={toast.description}
                variant={toast.variant}
                onClose={() => setToast(null)}
              />
            </div>
          )}

          <div className="contact-field mt-8 flex items-center justify-end gap-4">
            <button
              type="submit"
              disabled={sending}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-void transition-colors duration-300 hover:bg-violet-neon hover:text-white disabled:opacity-60"
            >
              {sending ? "Sending…" : "Send Message"}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
      </form>
    </div>
    </section>
  );
}
