"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, PRELOADER_DONE_EVENT } from "@/lib/gsap";
import { site } from "@/lib/data";

/**
 * Full-screen intro: a counter climbs to 100 while the name letters
 * stagger in, then the curtain sweeps up to reveal the page.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const counter = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          window.__preloaderDone = true;
          window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
          setDone(true);
        },
      });

      tl.from(".preloader-letter", {
        yPercent: 120,
        opacity: 0,
        stagger: 0.07,
        duration: 0.7,
        ease: "power4.out",
      })
        .to(
          counter,
          {
            value: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value)
                ).padStart(3, "0");
              }
            },
          },
          "<"
        )
        .to(".preloader-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, "<")
        .to(".preloader-content", {
          yPercent: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        })
        .to(root.current, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        });
    },
    { scope: root }
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-100 flex items-center justify-center bg-void"
      aria-hidden
    >
      <div className="preloader-content flex flex-col items-center gap-8 px-6">
        <h1 className="flex overflow-hidden font-display text-6xl font-extrabold uppercase tracking-tight sm:text-8xl">
          {site.name.split("").map((letter, i) => (
            <span key={i} className="preloader-letter inline-block text-gradient">
              {letter}
            </span>
          ))}
        </h1>

        <div className="h-px w-56 overflow-hidden bg-line sm:w-80">
          <div className="preloader-bar h-full w-full origin-left scale-x-0 bg-linear-to-r from-violet-neon to-cyan-neon" />
        </div>

        <span
          ref={counterRef}
          className="font-mono text-sm tracking-[0.4em] text-muted"
        >
          000
        </span>
      </div>
    </div>
  );
}
