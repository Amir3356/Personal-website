"use client";

import { useEffect, useRef, useState } from "react";
import { MdCheckCircleOutline, MdErrorOutline, MdClose } from "react-icons/md";

const DEFAULT_DURATION = 5000;
const EXIT_MS = 300; // must match the transition duration below

/**
 * Transient notification card. Mounts with a slide-in, holds for `duration`,
 * then animates out and calls `onClose` so the parent can drop it from state.
 *
 * Hovering pauses the countdown — a message shouldn't vanish while it's being
 * read — and it restarts when the pointer leaves.
 */
export default function Toast({
  open,
  title,
  description,
  variant = "success",
  duration = DEFAULT_DURATION,
  onClose,
}) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef(null);
  const exitRef = useRef(null);

  // Keep the latest onClose without restarting the timer when it changes.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const dismiss = () => {
    clearTimeout(timerRef.current);
    setLeaving(true);
    exitRef.current = setTimeout(() => onCloseRef.current?.(), EXIT_MS);
  };

  const startTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(dismiss, duration);
  };

  useEffect(() => {
    if (!open) return;

    setLeaving(false);
    // Paint once in the off-screen state so the transition actually runs.
    const raf = requestAnimationFrame(() => setVisible(true));
    startTimer();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timerRef.current);
      clearTimeout(exitRef.current);
      setVisible(false);
    };
    // `duration` is read through the closure at mount, which is what we want:
    // a re-render shouldn't extend a countdown that's already running.
  }, [open]);

  if (!open) return null;

  const isError = variant === "error";
  const Icon = isError ? MdErrorOutline : MdCheckCircleOutline;

  return (
    <div
      // Errors assert so they interrupt a screen reader; success is polite.
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => !leaving && startTimer()}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line/70 bg-surface/95 px-4 py-3.5 shadow-2xl ring-1 ring-black/20 backdrop-blur-md transition-all duration-300 ease-out ${
        visible && !leaving
          ? "translate-y-0 opacity-100"
          : "-translate-y-2 opacity-0"
      }`}
    >
      <Icon
        size={20}
        className={`mt-0.5 shrink-0 ${isError ? "text-red-400" : "text-cyan-neon"}`}
        aria-hidden
      />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification"
        className="-mr-1 grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-ink"
      >
        <MdClose size={16} />
      </button>
    </div>
  );
}
