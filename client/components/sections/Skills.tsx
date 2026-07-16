"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { marqueeWords, skillGroups } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const words = [...marqueeWords, ...marqueeWords];
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div
        className={`flex shrink-0 items-center gap-10 pr-10 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`flex items-center gap-10 font-display text-5xl font-extrabold tracking-tight whitespace-nowrap uppercase sm:text-7xl ${
              i % 2 === 0 ? "text-stroke" : "text-ink/90"
            }`}
          >
            {word}
            <span className="text-2xl text-violet-neon">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: (i % 4) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });

      // Marquee rows shift subtly against scroll for parallax depth
      gsap.to(".marquee-a", {
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".marquee-b", {
        xPercent: 6,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading kicker="04 — Techstack" title="Tools of the trade" />
      </div>

      {/* Kinetic type marquees */}
      <div className="marquee-a mb-4 -rotate-1">
        <MarqueeRow />
      </div>
      <div className="marquee-b rotate-1">
        <MarqueeRow reverse />
      </div>

      {/* Skill groups */}
      <div className="skill-grid mx-auto mt-20 grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        {skillGroups.map((group) => (
          <div
            key={group.title}
            data-cursor="hover"
            className="skill-card group rounded-2xl border border-line/60 bg-surface/50 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet-neon/50 hover:bg-elevate"
          >
            <span className="text-2xl text-cyan-neon transition-transform duration-500 group-hover:scale-125 inline-block">
              {group.icon}
            </span>
            <h3 className="mt-4 font-display text-xl font-bold">{group.title}</h3>
            <ul className="mt-5 space-y-2.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="flex items-center gap-2.5 text-sm text-muted transition-colors group-hover:text-ink/85"
                >
                  <span className="h-1 w-1 rounded-full bg-violet-soft" />
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
