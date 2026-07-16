"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { approach } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Approach() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".approach-card").forEach((card, i) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 0.9,
          delay: (i % 4) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        // Oversized step numeral drifts slower than the card (parallax)
        const numeral = card.querySelector(".approach-numeral");
        if (numeral) {
          gsap.fromTo(
            numeral,
            { yPercent: 18 },
            {
              yPercent: -18,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }
      });

      // Connecting line draws across the grid
      gsap.from(".approach-line", {
        scaleX: 0,
        transformOrigin: "left",
        ease: "none",
        scrollTrigger: {
          trigger: ".approach-grid",
          start: "top 80%",
          end: "bottom 70%",
          scrub: 0.6,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="approach" className="relative overflow-hidden py-28 lg:py-40">
      <div
        className="pointer-events-none absolute -left-40 bottom-0 h-130 w-130 rounded-full bg-cyan-neon/8 blur-[140px]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading kicker="05 — Approach" title="How I bring ideas to life" />

        <div className="approach-grid relative">
          {/* Progress line behind the cards (desktop) */}
          <div className="absolute top-10 right-0 left-0 hidden h-px bg-line/60 lg:block">
            <div className="approach-line h-full w-full bg-linear-to-r from-violet-neon to-cyan-neon" />
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((item) => (
              <li
                key={item.step}
                data-cursor="hover"
                className="approach-card group relative overflow-hidden rounded-2xl border border-line/60 bg-surface/50 p-7 pt-14 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-neon/50 hover:bg-elevate lg:mt-20"
              >
                <span
                  className="approach-numeral pointer-events-none absolute -top-6 -right-3 font-display text-8xl font-extrabold text-stroke opacity-60 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                >
                  {item.step}
                </span>

                <span className="relative grid h-10 w-10 place-items-center rounded-full border border-violet-neon/60 bg-void font-mono text-xs text-cyan-neon">
                  {item.step}
                </span>

                <h3 className="mt-5 font-display text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
