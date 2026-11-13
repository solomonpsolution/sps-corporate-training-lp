import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  COMPANY_SIZES,
  TOPIC_OPTIONS,
  isFreeEmail,
  isValidUaePhone,
  PHONE_DISPLAY,
  leadQuality,
  pushEvent,
  readAttribution,
  sendLeadEmail,
} from "@/lib/sps";

const empty = {
  full_name: "",
  work_email: "",
  phone: "+971 ",
  company: "",
  company_size: "",
  training_topic: "",
};
type Values = typeof empty;

const inputCls =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[15px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function LeadForm({ topic, id = "proposal-form" }: { topic: string; id?: string }) {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (topic) setV((p) => ({ ...p, training_topic: topic }));
  }, [topic]);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((p) => ({ ...p, [k]: e.target.value }));

  function validate() {
    const e: typeof errors = {};
    const req: (keyof Values)[] = ["full_name", "work_email", "phone", "company", "company_size", "training_topic"];
    for (const k of req) if (!v[k].trim() || v[k].trim() === "+971") e[k] = "Required";
    if (!e.work_email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.work_email.trim())) e.work_email = "Please enter a valid email";
      else if (isFreeEmail(v.work_email.trim())) e.work_email = "Please use your company email";
    }
    if (!e.phone && !isValidUaePhone(v.phone)) e.phone = "Please enter a valid UAE number, e.g. +971 50 123 4567";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    const quality = leadQuality(v.company_size);
    const attr = readAttribution();
    try {
      await sendLeadEmail({
        ...v,
        work_email: v.work_email.trim(),
        lead_quality: quality,
        ...attr,
        page_url: window.location.href,
        submitted_at: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }),
      });
      pushEvent({ event: "generate_lead", lead_quality: quality, training_topic: v.training_topic, company_size: v.company_size });
      sessionStorage.setItem("sps_lead", JSON.stringify({ training_topic: v.training_topic, company_size: v.company_size, lead_quality: quality }));
      navigate({ to: "/thankyou" });
    } catch {
      setSubmitError(`Sorry, we couldn't send your request. Please try again, or call us on ${PHONE_DISPLAY}. Your details are still here.`);
      setLoading(false);
    }
  }

  const field = (k: keyof Values, label: string, el: React.ReactNode, optional = false) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">
        {label} {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
      </span>
      {el}
      {errors[k] && <span className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
    </label>
  );
  const select = (k: keyof Values, opts: string[]) => (
    <select className={inputCls} value={v[k]} onChange={set(k)} aria-invalid={!!errors[k]}>
      <option value="">Select…</option>
      {opts.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="scroll-mt-6 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 md:p-7">
      <h2 className="font-display text-2xl text-foreground">Request a training proposal</h2>
      <div className="mt-5 space-y-4">
        {field("full_name", "Full name", <input className={inputCls} value={v.full_name} onChange={set("full_name")} autoComplete="name" />)}
        {field("work_email", "Work email", <input type="email" className={inputCls} value={v.work_email} onChange={set("work_email")} autoComplete="email" />)}
        {field("phone", "Mobile or WhatsApp number", <input type="tel" className={inputCls} value={v.phone} onChange={set("phone")} autoComplete="tel" />)}
        <div className="grid gap-4 sm:grid-cols-2">
          {field("company", "Company name", <input className={inputCls} value={v.company} onChange={set("company")} autoComplete="organization" />)}
          {field("company_size", "Company size", select("company_size", COMPANY_SIZES))}
        </div>
        {field("training_topic", "Training topic", select("training_topic", TOPIC_OPTIONS))}
      </div>
      {submitError && <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{submitError}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Request my proposal"}
      </button>
      <p className="mt-3 text-center text-sm text-muted-foreground">We reply within minutes during working hours.</p>
    </form>
  );
}
