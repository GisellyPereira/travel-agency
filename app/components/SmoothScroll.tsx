"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

let scrolling: Lenis | null = null;
let locks = 0;

export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const offset = id === "inicio" ? 0 : -(document.querySelector("header")?.getBoundingClientRect().height ?? 94) - 24;
  if (scrolling) {
    scrolling.resize();
    scrolling.scrollTo(target.getBoundingClientRect().top + window.scrollY, { offset });
  }
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "instant" });
}

export function lockPageScroll() {
  locks += 1;
  scrolling?.stop();
  return () => {
    locks = Math.max(0, locks - 1);
    if (!locks) scrolling?.start();
  };
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    function setup() {
      scrolling?.destroy();
      scrolling = reduced.matches ? null : new Lenis({ autoRaf: true, lerp: 0.09, smoothWheel: true });
      if (locks) scrolling?.stop();
    }
    function anchor(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = link?.getAttribute("href")?.slice(1);
      if (!id || !document.getElementById(id) || link?.hasAttribute("download")) return;
      event.preventDefault();
      history.pushState(null, "", `#${id}`);
      scrollToSection(id);
      const target = document.getElementById(id);
      if (target?.matches("a, button, input, [tabindex]")) target.focus({ preventScroll: true });
    }
    setup();
    reduced.addEventListener("change", setup);
    document.addEventListener("click", anchor);
    return () => {
      reduced.removeEventListener("change", setup);
      document.removeEventListener("click", anchor);
      scrolling?.destroy();
      scrolling = null;
    };
  }, []);
  return children;
}
