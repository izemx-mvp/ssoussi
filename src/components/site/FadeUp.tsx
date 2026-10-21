import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.2, 0.7, 0.2, 1] as const;
const VIEWPORT = { once: true, amount: 0.2 } as const;

/** Scroll reveal: fade + 24px rise, once, at 20 % visibility. Reduced motion keeps opacity only. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: reduce ? 0.3 : 0.75, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Back-compat alias used by older pages. */
export const FadeUp = Reveal;

const staggerParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/** Grid wrapper that staggers its <StaggerItem> children by 80 ms. */
export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0.3 : 0.7, ease: EASE } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
