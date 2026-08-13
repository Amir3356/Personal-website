"use client";

import { useRef } from "react";
import { useGSAP } from "@/lib/gsap";


export default function About() {
  const root = useRef(null);

  useGSAP(
    () => {},
    { scope: root }
  );

  return (
    <section ref={root} id="about" className="relative py-28 lg:py-40">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-130 w-130 rounded-full bg-violet-neon/10 blur-[140px]"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mt-14"></div>
      </div>
    </section>
  );
}
