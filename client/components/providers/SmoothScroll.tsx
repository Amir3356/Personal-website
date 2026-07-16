"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;

/** The active Lenis instance (null before mount / after unmount). */
export function getLenis() {
  return lenisInstance;
}

/**
 * Headless component: boots Lenis smooth scrolling and keeps
 * GSAP's ScrollTrigger perfectly in sync via the gsap ticker.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}

/** Smoothly scroll to an in-page anchor, respecting Lenis if active. */
export function scrollToSection(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
