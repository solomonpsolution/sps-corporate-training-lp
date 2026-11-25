import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { COURSE_OPTIONS } from "@/lib/courses";
import { adSource, isValidUaePhone, PHONE_DISPLAY, pushEvent, readAttribution, sendLeadEmail } from "@/lib/sps";

const empty = { full_name: "", email: "", phone: "+971 ", course: "" };
type Values = typeof empty;

const SEND_WAIT_MS = 4000;

const inputCls =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-[15px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function CourseForm({ course, id = "enquiry-form" }: { course: string; id?: string }) {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (course) setV((p) => ({ ...p, course }));
  }, [course]);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  function validate() {
    const e: typeof errors = {};
    for (const k of ["full_name", "email", "phone", "course"] as const) if (!v[k].trim() || v[k].trim() === "+971") e[k] = "Required";
    if (!e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email";
    if (!e.phone && !isValidUaePhone(v.phone)) e.phone = "Please enter a valid UAE number, e.g. +971 50 123 4567";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setLoading(true);
    const attr = readAttribution();
    const sending = sendLeadEmail({
      ...v,
      email: v.email.trim(),
      ad_source: adSource(attr),
      ...attr,
      page_url: window.location.href,
      submitted_at: new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" }),
    });
    sending.catch(() => {});
    const slow = new Promise<"slow">((r) => setTimeout(() => r("slow"), SEND_WAIT_MS));
    try {
      await Promise.race([sending, slow]);
      pushEvent({ event: "generate_lead", course: v.course });
      sessionStorage.setItem("sps_lead", JSON.stringify({ training_topic: v.course }));
      navigate({ to: "/courses-thankyou" });
    } catch {
      setSubmitError(`Sorry, we couldn't send your enquiry. Please try again, or call us on ${PHONE_DISPLAY}. Your details are still here.`);
      setLoading(false);
    }
  }

  const field = (k: keyof Values, label: string, el: React.ReactNode) => (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">{label}</span>
      {el}
      {errors[k] && <span className="mt-1 block text-sm text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="scroll-mt-6 rounded-2xl border border-border bg-card p-6 shadow-xl shadow-foreground/5 md:p-7">
      <h2 className="font-display text-2xl text-foreground">Enquire about this course</h2>
      <div className="mt-5 space-y-4">
        {field("full_name", "Full name", <input className={inputCls} value={v.full_name} onChange={set("full_name")} autoComplete="name" />)}
        {field("email", "Email", <input type="email" className={inputCls} value={v.email} onChange={set("email")} autoComplete="email" />)}
        {field("phone", "Mobile or WhatsApp number", <input type="tel" className={inputCls} value={v.phone} onChange={set("phone")} autoComplete="tel" />)}
        {field(
          "course",
          "Course",
          <select className={inputCls} value={v.course} onChange={set("course")} aria-invalid={!!errors.course}>
            <option value="">Select…</option>
            {COURSE_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>,
        )}
      </div>
      {submitError && <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{submitError}</p>}
      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Get course details"}
      </button>
      <p className="mt-3 text-center text-sm text-muted-foreground">We reply within minutes during working hours.</p>
    </form>
  );
}
