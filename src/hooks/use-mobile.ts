import { useSyncExternalStore } from "react";

export function useIsMobile(breakpoint: number = 768) {
  return useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      return mediaQuery.matches;
    },
    () => false, // SSR fallback
  );
}
