"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { projects } from "@/lib/data";
import SectionHeading from "@/components/ui/SectionHeading";

type Project = (typeof projects)[number];

function ProjectCard({ project }: { project: Project }) {
  const card = useRef<HTMLAnchorElement>(null);
  const quick = useRef<{
    rx: gsap.QuickToFunc;
    ry: gsap.QuickToFunc;
  } | null>(null);

  useGSAP(() => {
    if (!card.current) return;
    gsap.set(card.current, { transformPerspective: 800 });
    quick.current = {
      rx: gsap.quickTo(card.current, "rotationX", { duration: 0.5, ease: "power3" }),
      ry: gsap.quickTo(card.current, "rotationY", { duration: 0.5, ease: "power3" }),
    };
  });

  const onMove = (e: MouseEvent) => {
    const el = card.current;
    if (!el || !quick.current || !window.matchMedia("(pointer: fine)").matches)
      return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    quick.current.ry(px * 7);
    quick.current.rx(-py * 6);
  };

  const onLeave = () => {
    quick.current?.rx(0);
    quick.current?.ry(0);
  };

  return (
    <a
      ref={card}
      href={project.href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line/60 bg-surface/50 transition-colors duration-500 will-change-transform hover:border-violet-neon/50 hover:bg-elevate"
    >
      {/* Cover: screenshot when available, branded gradient otherwise */}
      <div
        className={`relative aspect-video shrink-0 overflow-hidden bg-linear-to-br ${project.gradient}`}
      >
        {project.image ? (
          <>
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 26rem"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-void/60 via-transparent to-void/20 transition-opacity duration-500 group-hover:opacity-30" />
          </>
        ) : (
          <span className="absolute -bottom-5 -right-1 font-display text-7xl leading-none font-extrabold text-void/40 transition-transform duration-700 group-hover:-translate-y-2">
            {project.index}
          </span>
        )}
        <span className="glass absolute top-3 left-3 rounded-full px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] text-white/90 uppercase">
          {project.category}
        </span>
        <span className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-void/50 text-sm backdrop-blur-sm transition-all duration-500 group-hover:rotate-45 group-hover:bg-ink group-hover:text-void">
          ↗
        </span>
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold transition-colors duration-300 group-hover:text-violet-soft">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line/70 px-2.5 py-0.5 font-mono text-[9px] tracking-widest text-muted uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </a>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: (i % 3) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className="relative py-28 lg:py-40">
      <div
        className="pointer-events-none absolute -right-40 top-0 h-130 w-130 rounded-full bg-cyan-neon/8 blur-[140px]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <SectionHeading kicker="02 — Projects" title="Projects with a pulse" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
