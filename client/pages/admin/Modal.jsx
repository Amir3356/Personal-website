import { useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";

/**
 * Centred dialog with a click-away backdrop. Closes on Escape and restores
 * focus to whatever opened it.
 */
export default function Modal({ open, title, onClose, children }) {
  const panelRef = useRef(null);
  const restoreTo = useRef(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement;
    // Move focus into the dialog so keyboard users aren't left behind it.
    panelRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
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
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-6"
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
        <div className="flex items-center justify-between border-b border-line/60 px-6 py-4">
          <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-ink"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
