"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { about } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

/** Renders text, turning @handles into YouTube channel links. */
function LinkedText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(@[A-Za-z0-9_]+)/g).map((part, i) =>
        part.startsWith("@") ? (
          <a
            key={i}
            href={`https://youtube.com/${part}`}
            target="_blank"
            rel="noreferrer"
            className="text-cyan-neon underline-offset-4 transition-colors hover:text-violet-soft hover:underline"
          >
            {part}
          </a>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Paragraphs: line-by-line masked reveal
      gsap.utils.toArray<HTMLElement>(".about-para").forEach((para) => {
        const split = SplitText.create(para, {
          type: "lines",
          linesClass: "line",
          mask: "lines",
        });
        gsap.set(para, { visibility: "visible" });
        gsap.from(split.lines, {
          yPercent: 110,
          stagger: 0.08,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: { trigger: para, start: "top 85%" },
        });
      });

      // Quote: bar draws down, text slides in
      gsap.from(".about-quote-bar", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.9,
        ease: "power3.inOut",
        scrollTrigger: { trigger: ".about-quote", start: "top 85%" },
      });
      gsap.from(".about-quote-text", {
        x: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".about-quote", start: "top 85%" },
      });

      // Value cards
      gsap.utils.toArray<HTMLElement>(".value-card").forEach((card, i) => {
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: (i % 2) * 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="relative py-28 lg:py-40">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-130 w-130 rounded-full bg-violet-neon/10 blur-[140px]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading kicker="01 — About" title={about.title} />

        <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
          {/* Story + quote */}
          <div>
            <div className="space-y-6">
              {about.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="about-para invisible text-lg leading-relaxed text-ink/85"
                >
                  <LinkedText text={paragraph} />
                </p>
              ))}
            </div>

            <blockquote className="about-quote mt-12 flex gap-5">
              <span className="about-quote-bar w-1 shrink-0 rounded-full bg-linear-to-b from-violet-neon to-cyan-neon" />
              <p className="about-quote-text font-display text-xl leading-snug font-bold text-ink sm:text-2xl">
                &ldquo;{about.quote}&rdquo;
              </p>
            </blockquote>
          </div>

          {/* Values: auto-rows-fr keeps every card the same height */}
          <div className="grid auto-rows-fr gap-5 sm:grid-cols-2">
            {about.values.map((value) => (
              <div
                key={value.title}
                data-cursor="hover"
                className="value-card group flex h-full flex-col rounded-2xl border border-line/60 bg-surface/50 p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-violet-neon/50 hover:bg-elevate"
              >
                <span className="inline-grid h-11 w-11 place-items-center rounded-xl border border-line/70 bg-void font-mono text-base text-cyan-neon transition-all duration-500 group-hover:scale-110 group-hover:border-cyan-neon/60">
                  {value.icon}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
