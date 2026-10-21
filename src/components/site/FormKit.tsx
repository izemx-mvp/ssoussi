import { motion, useReducedMotion } from "framer-motion";
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { Rosette } from "@/components/brand/Motif";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-input bg-cream px-4 text-[0.95rem] text-ink placeholder:text-muted-foreground/80 transition-colors focus-visible:border-clay-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay-deep/25 aria-[invalid=true]:border-destructive";

export function Field({
  id,
  label,
  error,
  children,
  className,
  hint,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
  className?: string;
  hint?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, ...props }, ref) {
    return <input ref={ref} className={cn(fieldClass, "h-12", className)} {...props} />;
  },
);

export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldClass, "min-h-32 py-3 leading-relaxed", className)}
      {...props}
    />
  );
});

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectInput({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          fieldClass,
          "h-12 appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10",
          className,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%232a1e17' stroke-width='1.5'/></svg>\")",
        }}
        {...props}
      >
        {children}
      </select>
    );
  },
);

/** Animated success state: the motif draws itself, then the message fades in. */
export function FormSuccess({
  title,
  text,
  again,
  onAgain,
}: {
  title: string;
  text: string;
  again: string;
  onAgain: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div role="status" className="flex flex-col items-center py-10 text-center">
      <motion.div
        initial={{ rotate: reduce ? 0 : -40, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
        className="draw-in text-clay"
      >
        <Rosette className="size-24" strokeWidth={1.4} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <h3 className="mt-6 text-3xl">{title}</h3>
        <p className="mx-auto mt-3 max-w-sm text-muted-foreground">{text}</p>
        <Button type="button" variant="line" className="mt-6" onClick={onAgain}>
          {again}
        </Button>
      </motion.div>
    </div>
  );
}
