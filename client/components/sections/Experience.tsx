"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/lib/data";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Spine grows as the timeline scrolls through the viewport
      gsap.from(".timeline-spine", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline",
          start: "top 75%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.from(item, {
          x: -50,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" },
        });
        gsap.from(item.querySelector(".timeline-dot"), {
          scale: 0,
          duration: 0.5,
          ease: "back.out(2.5)",
          scrollTrigger: { trigger: item, start: "top 82%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="journey" className="relative py-28 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="timeline relative mx-auto max-w-3xl">
          {/* Spine */}
          <div className="absolute top-0 bottom-0 left-[7px] w-px bg-line/70">
            <div className="timeline-spine h-full w-full bg-linear-to-b from-violet-neon to-cyan-neon" />
          </div>

          <ol className="space-y-16">
            {experience.map((item) => (
              <li key={item.period} className="timeline-item relative pl-12">
                <span className="timeline-dot absolute top-1.5 left-0 grid h-4 w-4 place-items-center rounded-full border border-violet-neon bg-void">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-neon" />
                </span>

                <p className="font-mono text-xs tracking-[0.3em] text-cyan-neon uppercase">
                  {item.period}
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
                  {item.role}
                  <span className="text-muted"> · {item.company}</span>
                </h3>
                <p className="mt-3 max-w-xl leading-relaxed text-muted">
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
