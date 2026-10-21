import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/i18n";

/** Counts up to `value` once it scrolls into view. */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const { locale } = useI18n();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.2, 0.7, 0.2, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value]);

  const fmt = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB");
  return (
    <span ref={ref} className={className}>
      {/* screen readers get the final value straight away */}
      <span aria-hidden>
        {fmt.format(n)}
        {suffix}
      </span>
      <span className="sr-only">
        {fmt.format(value)}
        {suffix}
      </span>
    </span>
  );
}
