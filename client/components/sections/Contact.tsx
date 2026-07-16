"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { site } from "@/lib/data";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = root.current?.querySelector(".contact-title");
      if (!title) return;

      // words wrapper prevents mid-word line breaks once chars become inline-blocks
      const split = SplitText.create(title, { type: "words,chars" });
      // Chars inside a .text-gradient span must carry the gradient
      // themselves — clip-to-text doesn't reach transformed children.
      split.chars.forEach((char) => {
        if ((char as HTMLElement).closest(".text-gradient")) {
          (char as HTMLElement).classList.add("text-gradient");
        }
      });
      gsap.set(title, { visibility: "visible" });

      gsap.from(split.chars, {
        yPercent: 120,
        opacity: 0,
        stagger: { each: 0.02, from: "random" },
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });

      gsap.from(".contact-fade", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="contact"
      className="relative overflow-hidden py-32 lg:py-48"
    >
      {/* Ambient glows */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-neon/12 blur-[160px]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 text-center lg:px-10">
        <p className="contact-fade font-mono text-xs tracking-[0.4em] text-cyan-neon uppercase">
          06 — Contact Us
        </p>

        <h2
          className="contact-title invisible mt-6 font-display text-[clamp(2.75rem,8.5vw,6rem)] leading-[1.02] font-extrabold tracking-tight"
          style={{ overflow: "hidden" }}
        >
          Let&apos;s build something{" "}
          {/* nowrap: the split char divs inside must never wrap mid-word */}
          <span className="text-gradient inline-block whitespace-nowrap">
            unforgettable
          </span>
        </h2>

        <p className="contact-fade mt-8 max-w-xl text-lg leading-relaxed text-muted">
          Have a project in mind, or just want to talk shaders and spring
          curves? My inbox is always open.
        </p>

        <div className="contact-fade mt-12">
          <MagneticButton
            href={`mailto:${site.email}`}
            className="px-10 py-5 text-base"
            strength={0.5}
          >
            {site.email}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </MagneticButton>
        </div>

        <p className="contact-fade mt-10 font-mono text-xs tracking-[0.3em] text-muted uppercase">
          {site.availability}
        </p>
      </div>
    </section>
  );
}
