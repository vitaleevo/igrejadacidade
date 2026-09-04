"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

export function getReducedMotionSnapshot() {
  return typeof window === "undefined" || window.matchMedia(query).matches;
}

export function getReducedMotionServerSnapshot() {
  return true;
}

export function subscribeToReducedMotion(onChange: () => void) {
  const preference = window.matchMedia(query);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
}
