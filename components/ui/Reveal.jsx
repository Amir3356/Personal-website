"use client";

import { createElement, useMemo } from "react";
import * as motionReact from "motion/react";
import { easeOut, fadeUp } from "@/utils/motion";

const { motion, useReducedMotion } = motionReact;

/**
 * Scroll-triggered fade-up wrapper, powered by framer-motion.
 *
 * Use this for plain reveals on elements GSAP does not already animate —
 * driving the same element from both libraries makes them fight over
 * `transform`. Respects `prefers-reduced-motion`.
 *
 * Any extra props (such as `data-*` attributes) pass through to the element.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * @param {string} [props.as] HTML tag to render. Defaults to a `div`.
 * @param {string} [props.className]
 * @param {number} [props.delay] Seconds to wait before animating in.
 * @param {number} [props.duration]
 * @param {boolean} [props.repeat] Replay on every scroll-in, not just the first.
 */
export default function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  duration = 0.9,
  repeat = false,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  // Memoized: `motion.create` returns a new component type on every call, which
  // would remount `children` on each render.
  const Component = useMemo(() => motion.create(as), [as]);

  if (reduceMotion) {
    return createElement(as, { className, ...rest }, children);
  }

  return (
    <Component
      className={className}
      {...rest}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount: 0.2 }}
      transition={{ duration, delay, ease: easeOut }}
    >
      {children}
    </Component>
  );
}
