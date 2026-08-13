"use client";

import { useRef, useState, useEffect } from "react";

import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/data";
import { api } from "@/lib/api";
import { assetUrl } from "@/lib/useSettings";

function ProjectCard({ project }) {
  const card = useRef(null);
  // { rx, ry } quickTo setters, created once the card mounts
  const quick = useRef(null);

  useGSAP(() => {
    if (!card.current) return;
    gsap.set(card.current, { transformPerspective: 800 });
    quick.current = {
      rx: gsap.quickTo(card.current, "rotationX", { duration: 0.5, ease: "power3" }),
      ry: gsap.quickTo(card.current, "rotationY", { duration: 0.5, ease: "power3" }),
    };
  });

  const onMove = (e) => {
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
    <div
      ref={card}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="project-card group flex h-full flex-col overflow-hidden rounded-2xl border border-line/60 bg-surface/50 transition-colors duration-500 will-change-transform hover:border-violet-neon/50 hover:bg-elevate"
    >
      {/* Cover: screenshot when available, branded gradient otherwise */}
      <div
        className={`relative aspect-[16/10] shrink-0 overflow-hidden bg-linear-to-br ${project.gradient}`}
      >
        {project.image ? (
          <>
            <img
              src={assetUrl(project.image)}
              alt={`Screenshot of ${project.title}`}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-void/60 via-transparent to-void/20 transition-opacity duration-500 group-hover:opacity-30" />
          </>
        ) : (
          <span className="absolute -bottom-5 -right-1 font-display text-7xl leading-none font-extrabold text-void/40 transition-transform duration-700 group-hover:-translate-y-2">
            {project.index}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold transition-colors duration-300 group-hover:text-violet-soft">
          {project.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-line/70 px-3 py-1 font-mono text-[10px] tracking-widest text-muted uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-violet-neon transition-colors duration-300 group-hover:text-cyan-neon"
        >
          View Details
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef(null);
  // Falls back to the bundled list so the grid still renders if the API is down.
  const [items, setItems] = useState(projects);

  useEffect(() => {
    let active = true;
    api
      .getProjects()
      .then((data) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  useGSAP(
    () => {
      gsap.utils.toArray(".project-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: (i % 3) * 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 90%", invalidateOnRefresh: true },
        });
      });

      // Cards can arrive from the API after the first paint, so re-measure.
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [items] }
  );

  return (
    <section ref={root} id="work" className="relative py-14 lg:py-20">
      <div
        className="pointer-events-none absolute -right-40 top-0 h-130 w-130 rounded-full bg-cyan-neon/8 blur-[140px]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          My Projects
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <ProjectCard key={project.id || project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
