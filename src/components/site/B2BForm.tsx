import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { Paperclip } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { useI18n, type Messages } from "@/i18n";
import { CONTACT_LIMITS, submitContact } from "@/lib/contacts";
import { Field, FormSuccess, SelectInput, TextArea, TextInput } from "./FormKit";

const projectTypes = ["hotel", "restaurant", "architecture", "retail", "import", "other"] as const;

const makeSchema = (t: Messages) =>
  z.object({
    company: z.string().trim().min(1, t.form.required).max(120, t.form.tooLong),
    name: z.string().trim().min(1, t.form.required).max(CONTACT_LIMITS.name, t.form.tooLong),
    email: z
      .string()
      .trim()
      .min(1, t.form.required)
      .email(t.form.invalidEmail)
      .max(CONTACT_LIMITS.email),
    phone: z.string().trim().max(40, t.form.tooLong),
    country: z.string().trim().min(1, t.form.required).max(80, t.form.tooLong),
    projectType: z.enum(projectTypes),
    quantities: z.string().trim().max(200, t.form.tooLong),
    deadline: z.string().trim().max(80, t.form.tooLong),
    message: z.string().trim().min(1, t.form.required).max(2200, t.form.tooLong),
    consent: z.literal(true, { errorMap: () => ({ message: t.form.consentRequired }) }),
  });
type Values = z.infer<ReturnType<typeof makeSchema>>;

/** Professional quote form. Saved to `contacts` (type "professionnel"); file picker is UI only. */
export function B2BForm() {
  const { t, lp } = useI18n();
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const schema = useMemo(() => makeSchema(t), [t]);
  const [files, setFiles] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: "",
      name: "",
      email: "",
      phone: "",
      country: "",
      projectType: "hotel",
      quantities: "",
      deadline: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (v) => {
    setFailed(false);
    // The contacts table has no dedicated B2B columns: the brief is composed into `message`.
    const lines = [
      `${t.form.b2b.company}: ${v.company}`,
      `${t.form.b2b.projectType}: ${t.form.b2b.projectTypes[v.projectType]}`,
    ];
    if (v.quantities) lines.push(`${t.form.b2b.quantities}: ${v.quantities}`);
    if (v.deadline) lines.push(`${t.form.b2b.deadline}: ${v.deadline}`);
    if (files.length > 0) lines.push(`${t.form.b2b.files}: ${files.join(", ")}`);
    lines.push("", v.message);
    try {
      await submitContact({
        name: v.name,
        email: v.email,
        phone: v.phone,
        country: v.country,
        type: "professionnel",
        message: lines.join("\n"),
      });
      setSent(true);
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
          setFiles([]);
          setSent(false);
        }}
      />
    );
  }

  const aria = (k: keyof Values) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-error` } : {};

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <Field id={id("company")} label={t.form.b2b.company} error={errors.company?.message}>
        <TextInput
          id={id("company")}
          autoComplete="organization"
          {...aria("company")}
          {...register("company")}
        />
      </Field>
      <Field id={id("name")} label={t.form.name} error={errors.name?.message}>
        <TextInput id={id("name")} autoComplete="name" {...aria("name")} {...register("name")} />
      </Field>
      <Field id={id("email")} label={t.form.email} error={errors.email?.message}>
        <TextInput
          id={id("email")}
          type="email"
          autoComplete="email"
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
      <Field id={id("projectType")} label={t.form.b2b.projectType}>
        <SelectInput id={id("projectType")} {...register("projectType")}>
          {projectTypes.map((k) => (
            <option key={k} value={k}>
              {t.form.b2b.projectTypes[k]}
            </option>
          ))}
        </SelectInput>
      </Field>
      <Field id={id("quantities")} label={t.form.b2b.quantities} error={errors.quantities?.message}>
        <TextInput id={id("quantities")} {...aria("quantities")} {...register("quantities")} />
      </Field>
      <Field id={id("deadline")} label={t.form.b2b.deadline} error={errors.deadline?.message}>
        <TextInput
          id={id("deadline")}
          type="month"
          {...aria("deadline")}
          {...register("deadline")}
        />
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
      <Field
        id={id("files")}
        label={t.form.b2b.files}
        hint={t.form.b2b.filesHint}
        className="sm:col-span-2"
      >
        <label
          htmlFor={id("files")}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-cream px-4 py-4 text-sm transition-colors hover:border-clay-deep focus-within:border-clay-deep"
        >
          <Paperclip className="size-4 text-clay-deep" aria-hidden />
          <span className="font-semibold text-safi">{t.form.b2b.chooseFiles}</span>
          <span className="truncate text-muted-foreground">
            {files.length ? files.join(", ") : t.form.b2b.noFile}
          </span>
          <input
            id={id("files")}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) => setFiles(Array.from(e.currentTarget.files ?? []).map((f) => f.name))}
          />
        </label>
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
