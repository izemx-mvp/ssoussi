import { cn } from "@/lib/utils";

/**
 * Hand-drawn underline stroke. Place inside an element with the `draw-underline`
 * utility; it draws itself on hover / focus / active route.
 */
export function DrawLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className={cn("draw-line text-clay", className)}
      aria-hidden
    >
      <path
        d="M1 5.2 C 18 3.4, 34 6.4, 52 4.6 S 84 3.2, 99 4.8"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
