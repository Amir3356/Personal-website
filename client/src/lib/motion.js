/** Matches the `power3.out` feel used by the GSAP animations. */
export const easeOut = [0.16, 1, 0.3, 1];

/** Fade + rise, mirroring the `y: 60, opacity: 0` GSAP reveals. */
export const fadeUp = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Parent wrapper that staggers its `fadeUp` children. */
export const staggerParent = (stagger = 0.1) => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger } },
});
