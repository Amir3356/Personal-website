"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap, useGSAP, SplitText, onPreloaderDone } from "@/lib/gsap";
import { site, hero } from "@/lib/data";
import MagneticButton from "@/components/ui/MagneticButton";
import { scrollToSection } from "@/components/providers/SmoothScroll";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const title = root.current?.querySelector(".hero-title");
      if (!title) return;

      const split = SplitText.create(title, {
        type: "words,chars",
        charsClass: "hero-char",
      });
      // Gradient must live on each char: background-clip:text on a parent
      // doesn't paint through SplitText's transformed child divs.
      split.chars.forEach((char) => {
        if ((char as HTMLElement).closest(".text-gradient")) {
          (char as HTMLElement).classList.add("text-gradient");
        }
      });

      gsap.set(root.current, { autoAlpha: 1 });
      // Initial states via set() so nothing flashes before the intro plays
      gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      gsap.set(".hero-fade", { y: 30, autoAlpha: 0 });
      gsap.set(".hero-photo", { x: 60, autoAlpha: 0, scale: 0.94 });

      const intro = gsap
        .timeline({ paused: true })
        .to(split.chars, {
          yPercent: 0,
          opacity: 1,
          stagger: 0.018,
          duration: 0.9,
          ease: "power4.out",
        })
        .to(
          ".hero-photo",
          { x: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "power3.out" },
          "-=0.6"
        )
        .to(
          ".hero-fade",
          { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.8, ease: "power3.out" },
          "-=0.7"
        );

      const cleanup = onPreloaderDone(() => intro.play());

      // Gentle perpetual float on the portrait
      gsap.to(".hero-photo-float", {
        y: -14,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Content drifts up and fades as you scroll past the hero
      gsap.to(".hero-content", {
        yPercent: -14,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "80% top",
          scrub: true,
        },
      });

      return () => {
        cleanup();
        split.revert();
      };
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="hero"
      className="invisible relative flex min-h-svh flex-col justify-center overflow-hidden"
    >
      {/* 3D backdrop */}
      <div className="absolute inset-0" aria-hidden>
        <HeroScene />
        {/* soften scene edges into the page */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-void/60 via-transparent to-void" />
      </div>

      <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-6 pt-28 pb-20 lg:px-10 lg:pt-24 lg:pb-0">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
          {/* Copy */}
          <div>
            <h1
              className="hero-title font-display text-[clamp(2.1rem,3.9vw,3.9rem)] leading-[1.08] font-extrabold tracking-tight [&_.hero-char]:inline-block"
              style={{ overflow: "hidden" }}
            >
              {hero.headingStart}
              <span className="text-gradient">{hero.headingHighlight}</span>
            </h1>

            <p className="hero-fade mt-7 max-w-xl text-lg leading-relaxed text-muted">
              {hero.intro}
            </p>

            <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton onClick={() => scrollToSection("#contact")}>
                Contact Me
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </MagneticButton>
              <MagneticButton variant="outline" href={hero.cvUrl} download>
                Download CV
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </MagneticButton>
            </div>
          </div>

          {/* Portrait */}
          <div className="hero-photo relative mx-auto w-full max-w-xs sm:max-w-sm">
            <div className="hero-photo-float relative">
              {/* Glow ring */}
              <div
                className="absolute -inset-1.5 rounded-[2rem] bg-linear-to-br from-violet-neon via-transparent to-cyan-neon opacity-70 blur-md"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[2rem] border border-line/60 bg-surface">
                <div className="relative aspect-4/5">
                  <Image
                    src="/images/amir.png"
                    alt={`Portrait of ${site.fullName}`}
                    fill
                    sizes="(max-width: 640px) 80vw, 24rem"
                    className="object-cover object-top"
                    priority
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-void/70 via-transparent to-transparent" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-fade absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-line p-1.5">
          <div className="h-2 w-1 animate-bounce rounded-full bg-cyan-neon" />
        </div>
      </div>
    </section>
  );
}
