"use client";

import { useRef } from "react";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";

type Props = {
  kicker: string;
  title: string;
  align?: "left" | "center";
};

/** Numbered kicker + big display title that reveals word-by-word on scroll. */
export default function SectionHeading({ kicker, title, align = "left" }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heading = root.current?.querySelector(".sh-title");
      if (!heading) return;

      const split = SplitText.create(heading, {
        type: "words",
        wordsClass: "sh-word",
      });

      gsap.set(heading, { visibility: "visible" });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
        rotate: 4,
        stagger: 0.06,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      gsap.from(".sh-kicker", {
        opacity: 0,
        x: align === "center" ? 0 : -24,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 80%" },
      });

      return () => split.revert();
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className={`mb-14 flex flex-col gap-4 md:mb-20 ${
        align === "center" ? "items-center text-center" : ""
      }`}
    >
      <span className="sh-kicker font-mono text-xs tracking-[0.35em] text-cyan-neon uppercase">
        {kicker}
      </span>
      <h2
        className="sh-title invisible font-display text-4xl font-bold tracking-tight [&_.sh-word]:inline-block sm:text-5xl lg:text-6xl"
        style={{ overflow: "hidden" }}
      >
        {/* "\n" in the title becomes a hard line break */}
        {title.split("\n").map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}
