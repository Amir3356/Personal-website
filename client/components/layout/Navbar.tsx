"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, onPreloaderDone } from "@/lib/gsap";
import { navLinks, site } from "@/lib/data";
import { getLenis, scrollToSection } from "@/components/providers/SmoothScroll";

export default function Navbar() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      // Drop in after the preloader curtain lifts
      gsap.set(root.current, { yPercent: -120 });
      const cleanup = onPreloaderDone(() => {
        gsap.to(root.current, {
          yPercent: 0,
          duration: 0.9,
          ease: "power4.out",
          delay: 0.2,
        });
      });

      // Frosted background once the page is scrolled
      ScrollTrigger.create({
        start: "top -40",
        onUpdate: (self) => {
          root.current?.classList.toggle("nav-scrolled", self.progress > 0);
        },
      });

      return cleanup;
    },
    { scope: root }
  );

  const go = (href: string) => {
    setOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      ref={root}
      className="group/nav fixed inset-x-0 top-0 z-80 transition-colors [&.nav-scrolled]:glass"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => go(link.href)}
                className="group relative font-mono text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:text-ink"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-violet-neon to-cyan-neon transition-all duration-300 group-hover:w-full" />
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`glass grid overflow-hidden transition-all duration-500 md:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <ul className="min-h-0 space-y-1 px-6 pb-2">
          {navLinks.map((link, i) => (
            <li key={link.href} className={i === 0 ? "pt-4" : ""}>
              <button
                onClick={() => go(link.href)}
                className="block w-full py-3 text-left font-display text-2xl font-bold text-ink"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li className="pb-4">
            <a
              href={`mailto:${site.email}`}
              className="block py-3 font-mono text-xs tracking-widest text-cyan-neon uppercase"
            >
              {site.email}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
