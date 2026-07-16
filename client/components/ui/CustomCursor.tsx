"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * A dot + trailing ring cursor. The ring expands over any element
 * carrying `data-cursor="hover"`. Desktop (fine pointer) only.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const enabled = useRef(false);

  useGSAP(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    enabled.current = true;
    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });

    const move = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const hoverable = (e.target as HTMLElement).closest(
        "a, button, [data-cursor='hover']"
      );
      gsap.to(ring.current, {
        scale: hoverable ? 2.2 : 1,
        opacity: hoverable ? 0.4 : 1,
        duration: 0.3,
      });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  });

  useEffect(() => {
    return () => {
      if (enabled.current) {
        document.documentElement.classList.remove("has-custom-cursor");
      }
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-90 hidden [@media(pointer:fine)]:block">
      <div
        ref={dot}
        className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-cyan-neon"
      />
      <div
        ref={ring}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border border-violet-soft/70"
      />
    </div>
  );
}
