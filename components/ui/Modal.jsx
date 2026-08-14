"use client";

import { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";

/**
 * Centred dialog with a click-away backdrop. Closes on Escape and restores
 * focus to whatever opened it.
 */
export default function Modal({ open, title, onClose, children }) {
  const panelRef = useRef(null);
  const restoreTo = useRef(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement;
    // Move focus into the dialog so keyboard users aren't left behind it.
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown);

    // Stop the page behind the dialog from scrolling.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreTo.current?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(e) => {
        // Only a press that starts on the backdrop dismisses, so a drag that
        // ends outside the panel doesn't close the dialog unexpectedly.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="my-auto w-full max-w-lg rounded-2xl border border-line/60 bg-surface shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line/60 px-4 py-3.5 sm:px-6 sm:py-4">
          <h3 className="min-w-0 truncate font-display text-base font-bold text-ink sm:text-lg">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-ink"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* break-words stops a long unbroken string (a pasted URL, a run of
            characters with no spaces) from forcing a horizontal scrollbar. */}
        <div className="max-h-[75vh] overflow-y-auto overflow-x-hidden px-4 py-4 break-words sm:max-h-[70vh] sm:px-6 sm:py-5">
          {children}
        </div>
      </div>
    </div>
  );
}
