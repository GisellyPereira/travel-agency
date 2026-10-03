"use client";

import { motion } from "framer-motion";
import type { ReactNode, SVGProps } from "react";
import styles from "./primitives.module.css";

export type IconName =
  | "search"
  | "arrow"
  | "close"
  | "pin"
  | "calendar"
  | "users"
  | "check"
  | "download"
  | "chevron"
  | "sun"
  | "heart"
  | "compass"
  | "mountain"
  | "leaf"
  | "globe"
  | "wave"
  | "menu"
  | "plane";
export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    arrow: (
      <>
        <path d="M4 12h15M13 5l7 7-7 7" />
      </>
    ),
    close: <path d="m6 6 12 12M6 18 18 6" />,
    pin: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
        <circle cx="12" cy="10" r="2.3" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2" />
      </>
    ),
    users: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    download: (
      <>
        <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />
      </>
    ),
    chevron: <path d="m7 10 5 5 5-5" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" />
      </>
    ),
    heart: (
      <path d="M20.5 4.9a5.5 5.5 0 0 0-7.8 0l-.7.7-.7-.7a5.5 5.5 0 0 0-7.8 7.8L12 21l8.5-8.3a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16.5 7.5-3 6-6 3 3-6 6-3Z" />
      </>
    ),
    mountain: (
      <>
        <path d="m2 20 7-15 6 15H2Zm11-11 3-5 7 16h-6M6.5 10.5 9 13l2.5-2.5" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 3c0 10-3 15-9 15a6 6 0 0 1-6-6C5 6 12 5 20 3ZM3 22 15 10" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 7h14M5 17h14" />
      </>
    ),
    wave: (
      <>
        <path d="M2 10c3-4 5 4 9 0s6 4 11 0M2 16c3-4 5 4 9 0s6 4 11 0" />
        <circle cx="17" cy="4" r="2" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plane: <path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
export function Brand() {
  return (
    <span className={styles.brand}>
      <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 34 21 12l9 12 6-7 9 17" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M5 40c12-9 24 4 38-6M13 28l8-16 5 17" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
      <span className={styles.wordmark}>Travel<small>Agency</small></span>
    </span>
  );
}
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`${styles.eyebrow} ${light ? styles.eyebrowLight : ""}`}>
      <span />
      {children}
    </p>
  );
}
