"use client";

import { useRef, useState, useEffect } from "react";

import { FaGithub } from "react-icons/fa";

import { gsap, useGSAP, ScrollTrigger } from "@/utils/gsap";
import { projects } from "@/utils/data";
import { api } from "@/services";
import { assetUrl } from "@/hooks/useSettings";
import Modal from "@/components/ui/Modal";

/**
 * A URL typed without a scheme ("github.com/me/repo") would be treated as a
 * path relative to the site, so add https:// when it's missing.
 */
function normalizeUrl(url) {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function ProjectCard({ project, onView }) {
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
        <h3 className="font-display text-xl font-bold break-words transition-colors duration-300 group-hover:text-violet-soft">
          {project.title}
        </h3>
        {/* break-words so an unbroken run of characters (no spaces to wrap on)
            folds instead of overflowing and being clipped by the card. */}
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed break-words text-muted">
          {project.description}
        </p>
        <ul className="mt-5 flex flex-1 flex-wrap content-start gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="max-w-full rounded-full border border-line/70 px-3 py-1 font-mono text-[10px] tracking-widest break-all text-muted uppercase"
            >
              {tag}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => onView(project)}
          className="mt-6 inline-flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium text-violet-neon transition-colors duration-300 group-hover:text-cyan-neon"
        >
          View Details
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

export default function Projects() {
  const root = useRef(null);
  // Falls back to the bundled list so the grid still renders if the API is down.
  const [items, setItems] = useState(projects);
  const [active, setActive] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .getProjects()
      .then((data) => {
        // Trust any array the API returns, including an empty one — bailing on
        // `data.length` would leave deleted projects on screen forever.
        if (active && Array.isArray(data)) setItems(data);
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

        {items.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((project) => (
              <ProjectCard
                key={project.id || project.title}
                project={project}
                onView={setActive}
              />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-muted">No projects to show yet.</p>
        )}
      </div>

      <Modal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.title || "Project"}
        headerAction={
          active?.href?.trim() && (
            <a
              href={normalizeUrl(active.href)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${active.title} repository in a new tab`}
              title="Open repository"
              className="grid h-9 w-9 place-items-center rounded-md text-muted transition-colors hover:bg-line/40 hover:text-cyan-neon"
            >
              <FaGithub size={18} />
            </a>
          )
        }
      >
        {active && (
          /* Text-only by design — the card already shows the image, summary and
             tags; the repo link lives in the header. */
          <div className="flex flex-col gap-5">
            {/* overflow-wrap handles long words so a pasted URL can't widen
                the dialog. */}
            <p className="text-sm leading-relaxed break-words whitespace-pre-line text-ink">
              {active.detail?.trim() || "No further details have been added for this project yet."}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}
