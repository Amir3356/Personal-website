"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { experience } from "@/lib/data";

function WorkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="2.5" y="7" width="19" height="13" rx="2" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
      <path d="M2.5 12h19" />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13 2.5 8.5Z" />
      <path d="M6.5 10.8V15c0 1.4 2.5 2.6 5.5 2.6s5.5-1.2 5.5-2.6v-4.2" />
    </svg>
  );
}

export default function Experience() {
  const root = useRef(null);

  useGSAP(
    () => {
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

      gsap.utils.toArray(".timeline-item").forEach((item) => {
        gsap.from(item.querySelector(".timeline-card"), {
          x: item.dataset.side === "right" ? 50 : -50,
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
        <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Experiences(3 years)
        </h2>
        <p className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full border border-violet-neon/30 bg-violet-neon/10 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-neon" />
          Overall 3 Years Experiences
        </p>

        <div className="timeline relative mx-auto mt-16 max-w-5xl">
          {/* Spine — left rail on mobile, centered on desktop */}
          <div className="absolute top-0 bottom-0 left-[15px] w-px bg-line/70 md:left-1/2 md:-translate-x-1/2">
            <div className="timeline-spine h-full w-full bg-linear-to-b from-violet-neon to-cyan-neon" />
          </div>

          <ol className="space-y-10 md:space-y-16">
            {experience.map((item, i) => {
              const right = i % 2 === 1;

              return (
                <li
                  key={item.period}
                  data-side={right ? "right" : "left"}
                  className="timeline-item relative pl-12 md:grid md:grid-cols-2 md:gap-x-16 md:pl-0"
                >
                  {/* Node */}
                  <span className="timeline-dot absolute top-4 left-0 z-10 grid h-8 w-8 place-items-center rounded-full border border-violet-neon bg-void text-cyan-neon shadow-[0_0_18px_-4px_var(--color-violet-neon)] md:left-1/2 md:-translate-x-1/2">
                    {item.kind === "education" ? <EducationIcon /> : <WorkIcon />}
                  </span>

                  {/* Card — alternates sides on desktop */}
                  <div
                    className={
                      right
                        ? "timeline-card md:col-start-2"
                        : "timeline-card md:col-start-1 md:row-start-1"
                    }
                  >
                    <div className="rounded-2xl border border-line/70 bg-surface/70 p-6 backdrop-blur-sm transition-colors hover:border-violet-neon/50 sm:p-7">
                      <p className="inline-flex rounded-full border border-violet-neon/30 bg-violet-neon/10 px-3 py-1 font-mono text-xs tracking-[0.2em] text-cyan-neon uppercase">
                        {item.period}
                      </p>

                      <h3 className="mt-4 font-display text-xl font-bold sm:text-2xl">
                        {item.role}
                      </h3>
                      <p className="mt-1 text-sm text-muted">{item.company}</p>

                      <p className="mt-4 text-sm leading-relaxed text-muted">
                        {item.description}
                      </p>

                      {item.tags?.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full bg-violet-neon/85 px-3 py-1 text-xs font-medium text-white"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
