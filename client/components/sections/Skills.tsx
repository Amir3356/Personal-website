"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { skillGroups } from "@/lib/data";

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
    },
    { scope: root }
  );

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-28 lg:py-40">
      {/* Skill groups */}
      <div className="skill-grid mx-auto mt-10 grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
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
