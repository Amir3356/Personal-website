"use client";

import { skillGroups } from "@/utils/data";
import Reveal from "@/components/ui/Reveal";

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden py-28 lg:py-40">
      <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        Techstack
      </h2>

      {/* Skill groups */}
      <div className="skill-grid mx-auto mt-14 grid max-w-7xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-10">
        {skillGroups.map((group, i) => (
          <Reveal
            key={group.title}
            delay={(i % 4) * 0.1}
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
          </Reveal>
        ))}
      </div>
    </section>
  );
}
