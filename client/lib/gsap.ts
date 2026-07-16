import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Fired by the preloader once its exit animation completes. */
export const PRELOADER_DONE_EVENT = "amir:preloader-done";

declare global {
  interface Window {
    __preloaderDone?: boolean;
  }
}

/**
 * Runs `callback` when the preloader has finished (or immediately if it
 * already has). Returns a cleanup function.
 */
export function onPreloaderDone(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.__preloaderDone) {
    callback();
    return () => {};
  }
  window.addEventListener(PRELOADER_DONE_EVENT, callback, { once: true });
  return () => window.removeEventListener(PRELOADER_DONE_EVENT, callback);
}
