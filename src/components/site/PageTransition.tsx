import { useRouterState } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Short page transition (≤ 400 ms): a clay-coloured wipe sweeps across, and the new
 * page fades in. Skipped on first load (the loader covers it) and with reduced motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  // Compare with the previous pathname (not a "first run" flag) so StrictMode's double effect never wipes on load.
  const previous = useRef(pathname);
  const [wipe, setWipe] = useState(0);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    if (!reduce) setWipe((w) => w + 1);
  }, [pathname, reduce]);

  return (
    <>
      <motion.div
        key={pathname}
        initial={previous.current === pathname ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {children}
      </motion.div>
      {wipe > 0 && (
        <motion.div
          key={wipe}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[70] origin-right bg-clay"
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
        />
      )}
    </>
  );
}
