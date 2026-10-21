import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useI18n, type Messages } from "@/i18n";
import { CONTACT_LIMITS, submitContact } from "@/lib/contacts";
import { Field, FormSuccess, SelectInput, TextArea, TextInput } from "./FormKit";

export const requestTypes = ["particulier", "professionnel", "export", "visite", "presse"] as const;
export type RequestType = (typeof requestTypes)[number];

const makeSchema = (t: Messages) =>
  z.object({
    name: z.string().trim().min(1, t.form.required).max(CONTACT_LIMITS.name, t.form.tooLong),
    email: z
      .string()
      .trim()
      .min(1, t.form.required)
      .email(t.form.invalidEmail)
      .max(CONTACT_LIMITS.email),
    phone: z.string().trim().max(40, t.form.tooLong),
    country: z.string().trim().max(80, t.form.tooLong),
    type: z.enum(requestTypes),
    message: z.string().trim().min(1, t.form.required).max(2800, t.form.tooLong),
    consent: z.literal(true, { errorMap: () => ({ message: t.form.consentRequired }) }),
  });
type Values = z.infer<ReturnType<typeof makeSchema>>;

/**
 * Contact / quote form, saved to the `contacts` table.
 * `mode="quote"` stores type = "devis" with the product reference (global quote dialog).
 */
export function ContactForm({
  mode = "contact",
  defaultType = "particulier",
  productRef,
  onDone,
}: {
  mode?: "contact" | "quote";
  defaultType?: RequestType;
  productRef?: string | undefined;
  onDone?: () => void;
}) {
  const { t, lp } = useI18n();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const schema = useMemo(() => makeSchema(t), [t]);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", country: "", type: defaultType, message: "" },
  });

  const onSubmit = handleSubmit(async (v) => {
    setFailed(false);
    try {
      await submitContact({
        name: v.name,
        email: v.email,
        phone: v.phone,
        country: v.country,
        type: mode === "quote" ? "devis" : v.type,
        message: mode === "quote" ? `[${t.form.types[v.type]}] ${v.message}` : v.message,
        product_ref: productRef,
      });
      setSent(true);
      onDone?.();
    } catch {
      setFailed(true);
    }
  });

  if (sent) {
    return (
      <FormSuccess
        title={t.form.successTitle}
        text={t.form.successText}
        again={t.form.another}
        onAgain={() => {
          reset();
          setSent(false);
        }}
      />
    );
  }

  const aria = (k: keyof Values) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-error` } : {};

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
      {productRef && (
        <p className="rounded-xl border border-border bg-sand px-4 py-3 text-sm sm:col-span-2">
          <span className="text-muted-foreground">{t.quote.forProduct} : </span>
          <strong className="font-semibold text-safi">{productRef}</strong>
        </p>
      )}
      <Field id={id("name")} label={t.form.name} error={errors.name?.message}>
        <TextInput id={id("name")} autoComplete="name" {...aria("name")} {...register("name")} />
      </Field>
      <Field id={id("email")} label={t.form.email} error={errors.email?.message}>
        <TextInput
          id={id("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          {...aria("email")}
          {...register("email")}
        />
      </Field>
      <Field id={id("phone")} label={t.form.phone} error={errors.phone?.message}>
        <TextInput
          id={id("phone")}
          type="tel"
          autoComplete="tel"
          {...aria("phone")}
          {...register("phone")}
        />
      </Field>
      <Field id={id("country")} label={t.form.country} error={errors.country?.message}>
        <TextInput
          id={id("country")}
          autoComplete="country-name"
          {...aria("country")}
          {...register("country")}
        />
      </Field>
      <Field id={id("type")} label={t.form.requestType} className="sm:col-span-2">
        <SelectInput id={id("type")} {...register("type")}>
          {requestTypes.map((k) => (
            <option key={k} value={k}>
              {t.form.types[k]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field
        id={id("message")}
        label={t.form.message}
        error={errors.message?.message}
        className="sm:col-span-2"
      >
        <TextArea
          id={id("message")}
          rows={5}
          placeholder={t.form.messagePlaceholder}
          {...aria("message")}
          {...register("message")}
        />
      </Field>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-[var(--clay-deep)]"
            {...aria("consent")}
            {...register("consent")}
          />
          <span>
            {t.form.consent}{" "}
            <Link
              to="/{-$locale}/confidentialite"
              params={lp}
              className="text-safi underline underline-offset-4"
            >
              {t.nav.privacy}
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p
            id={`${id("consent")}-error`}
            role="alert"
            className="mt-1.5 text-xs font-medium text-destructive"
          >
            {errors.consent.message}
          </p>
        )}
      </div>
      {failed && (
        <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">
          {t.form.error}
        </p>
      )}
      <div className="sm:col-span-2">
        <Button
          type="submit"
          variant="clay"
          size="xl"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? t.form.sending : t.form.send}
        </Button>
      </div>
    </form>
  );
}
