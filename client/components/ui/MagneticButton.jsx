"use client";

import { useRef } from "react";
import { gsap } from "@/utils/gsap";

/**
 * Button/link that leans toward the cursor and springs back on leave.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.href] Renders an `<a>` instead of a `<button>`.
 * @param {() => void} [props.onClick]
 * @param {"solid" | "outline"} [props.variant]
 * @param {string} [props.className]
 * @param {number} [props.strength] How far it follows the cursor, 0–1.
 * @param {boolean} [props.download]
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  strength = 0.35,
  download,
}) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.35)" });
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-medium text-sm tracking-wide transition-colors duration-300 " +
    (variant === "solid"
      ? "bg-ink text-void hover:bg-violet-neon hover:text-white"
      : "border border-line text-ink hover:border-violet-neon hover:text-violet-soft");

  const props = {
    className: `${base} ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    onClick,
  };

  if (href) {
    return (
      <a ref={ref} href={href} download={download} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" {...props}>
      {children}
    </button>
  );
}
