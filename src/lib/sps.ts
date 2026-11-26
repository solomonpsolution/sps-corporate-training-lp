// Shared config and pure helpers for the Solomon People Solutions ads landing page.

// Tracking. Leave empty until the real IDs exist; nothing loads while empty.
export const GTM_ID = ""; // e.g. "GTM-ABC1234"
export const GOOGLE_ADS_ID = "AW-925863685";
export const GOOGLE_ADS_LEAD_LABEL = "8SiyCMiNoLYdEIWevrkD"; // SPS NEW CT LP - FORM SUBMIT (primary)
export const GOOGLE_ADS_WHATSAPP_LABEL = "qlVkCMuNoLYdEIWevrkD"; // SPS NEW CT LP - WHATSAPP CLICK (secondary)
export const GOOGLE_ADS_PHONE_LABEL = "R-RcCM6NoLYdEIWevrkD"; // SPS NEW CT LP - PHONE CLICK (secondary)
// Courses page (/corporate-training-lp/courses) has its own conversion actions.
export const CERT_LEAD_LABEL = "v5FjCIiEnr8dEIWevrkD"; // SPS CERT LP - FORM SUBMIT
export const CERT_WHATSAPP_LABEL = "B26pCIuEnr8dEIWevrkD"; // SPS CERT LP - WHATSAPP CLICK
export const CERT_PHONE_LABEL = "SCv1CI6Enr8dEIWevrkD"; // SPS CERT LP - PHONE CLICK

/** Conversion labels for the page the visitor is on. */
export function pageLabels() {
  const courses = typeof window !== "undefined" && window.location.pathname.includes("/courses");
  return courses
    ? { lead: CERT_LEAD_LABEL, whatsapp: CERT_WHATSAPP_LABEL, phone: CERT_PHONE_LABEL }
    : { lead: GOOGLE_ADS_LEAD_LABEL, whatsapp: GOOGLE_ADS_WHATSAPP_LABEL, phone: GOOGLE_ADS_PHONE_LABEL };
}
export const CLARITY_ID = "zh0l06j1pj"; // Microsoft Clarity project "sps"

// Leads are emailed to LEAD_EMAIL through FormSubmit (formsubmit.co), with a copy to LEAD_CC.
// The first submission to a new LEAD_EMAIL sends an activation email to that inbox; click it once.
// Until it is activated, leads fall back to LEAD_CC (already active) so no enquiry is lost.
export const LEAD_EMAIL = "info@solomonpeoplesolutions.com";
export const LEAD_CC = "mercyget4@gmail.com";
export const LEAD_CC_TEAM = "ayush@solomonpeoplesolutions.com"; // also copied on every lead (corporate and courses)
export const ZOHO_BOOKINGS_URL = "https://PLACEHOLDER-zoho-bookings-link"; // PLACEHOLDER
export const WHATSAPP_NUMBER = "971552815948";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_DISPLAY = "+971 55 281 5948";
export const PHONE_TEL = "tel:+971552815948";
export const ADDRESS =
  "Office #51, 9th & 10th Floor, Crystal Tower, Millennium Central Downtown, Al Asayel St, Marasi Drive, Downtown Dubai, UAE";

export const TOPICS = [
  "Leadership and Management",
  "Sales and Customer Service",
  "Communication and Soft Skills",
  "Train the Trainer",
  "HR Training",
] as const;
export const TOPIC_OPTIONS = [...TOPICS, "Not sure yet"];
export const COMPANY_SIZES = ["1 to 50", "51 to 200", "201 to 500", "501 to 1,000", "1,000+"];

export const HEADLINES: Record<string, string> = {
  leadership: "When leadership slips, results follow. Training built for your managers in Dubai",
  sales: "Sales and customer service training that lifts team performance",
  hr: "CPD accredited Train the Trainer for HR and L&D teams in Dubai",
  employee: "Employee and staff training that builds skills your team uses at work",
  communication: "Communication and soft skills training for your employees in Dubai",
  "hr-training": "HR training for HR teams and people managers in Dubai",
};
export const DEFAULT_HEADLINE = "Corporate Training built around your team";
export const URL_TOPIC_TO_FORM: Record<string, string> = {
  leadership: TOPICS[0],
  sales: TOPICS[1],
  hr: TOPICS[3],
  communication: TOPICS[2],
  "hr-training": TOPICS[4],
};

export function headlineFor(topic: string | null | undefined) {
  return (topic && HEADLINES[topic.toLowerCase()]) || DEFAULT_HEADLINE;
}

/** Real-looking name: at least 2 letters, and not one letter repeated ("Hh", "aaaa"). */
export function nameError(name: string): string {
  const letters = name.toLowerCase().replace(/[^\p{L}]/gu, "");
  if (letters.length < 2) return "Please enter your full name";
  if (new Set(letters).size < 2) return "Please enter your real name";
  return "";
}

// Common misspellings of real email endings, e.g. gmail.vom or yahoo.con.
const BAD_TLDS = ["vom", "con", "cpm", "xom", "cim", "comm", "nett", "ner"];
const BAD_DOMAINS = ["gmial.com", "gmai.com", "gamil.com", "gnail.com", "gmail.co", "hotmial.com", "hotmal.com", "yaho.com", "outlok.com"];

export function emailError(email: string): string {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(e)) return "Please enter a valid email";
  const [user = "", domain = ""] = e.split("@");
  const tld = domain.split(".").pop() ?? "";
  if (BAD_TLDS.includes(tld) || BAD_DOMAINS.includes(domain)) return "Please check your email address";
  if (new Set(user.replace(/[^a-z0-9]/g, "")).size < 2) return "Please check your email address";
  return "";
}

export function isValidUaePhone(phone: string) {
  const d = phone.replace(/[\s\-()]/g, "");
  return /^(\+971|00971|0)?(5\d{8}|[2-9]\d{7})$/.test(d);
}

/** Qualified = company with 51 or more staff. */
export function leadQuality(size: string): "qualified" | "standard" {
  return COMPANY_SIZES.indexOf(size) >= 1 ? "qualified" : "standard";
}

// ---- Tracking (browser only) ----
export const TRACK_KEYS = ["gclid", "gbraid", "wbraid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "topic", "course"] as const;
const COOKIE = "sps_attr";

export function readAttribution(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  try {
    return m ? JSON.parse(decodeURIComponent(m[1] ?? "")) : {};
  } catch {
    return {};
  }
}

export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const current = readAttribution();
  let changed = false;
  for (const k of TRACK_KEYS) {
    const v = params.get(k);
    if (v) {
      current[k] = v;
      changed = true;
    }
  }
  // Remember where the first visit came from (e.g. google.com, or empty for a direct visit).
  if (!("referrer" in current)) {
    current["referrer"] = document.referrer ? new URL(document.referrer).hostname : "direct";
    changed = true;
  }
  if (changed) {
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(current))}; max-age=${60 * 60 * 24 * 90}; path=/; SameSite=Lax`;
  }
  return current;
}

/** Plain-language source for the lead email. */
export function adSource(attr: Record<string, string>): string {
  if (attr["gclid"] || attr["gbraid"] || attr["wbraid"]) return "Google Ads click";
  if (attr["utm_source"]) return `Tagged link: ${attr["utm_source"]}`;
  return `Not from an ad (came from: ${attr["referrer"] || "unknown"})`;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
async function postLead(to: string, cc: string, lead: Record<string, string>) {
  const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    // keepalive lets the request finish even if the visitor closes the tab.
    keepalive: true,
    body: JSON.stringify({
      _subject: lead["course"] ? `New course enquiry: ${lead["course"]} (${lead["full_name"] ?? ""})` : `New training lead: ${lead["company"] ?? ""} (${lead["lead_quality"] ?? ""})`,
      _template: "table",
      _captcha: "false",
      ...(cc ? { _cc: cc } : {}),
      ...lead,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!res.ok || String(json.success) !== "true") throw new Error(json.message || `status ${res.status}`);
}

export async function sendLeadEmail(lead: Record<string, string>) {
  try {
    await postLead(LEAD_EMAIL, `${LEAD_CC},${LEAD_CC_TEAM}`, lead);
  } catch {
    // Main inbox not activated yet or temporarily failing: send to the backup inbox instead.
    await postLead(LEAD_CC, `${LEAD_EMAIL},${LEAD_CC_TEAM}`, lead);
  }
}

/** Sends a Google Ads conversion for the given label, if the tag is loaded. */
export function adsConversion(label: string) {
  if (typeof window === "undefined" || !GOOGLE_ADS_ID || !label) return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${label}` });
}

export function pushEvent(data: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export const noindexMeta = [
  { name: "robots", content: "noindex, nofollow" },
  { property: "og:type", content: "website" },
  { name: "twitter:card", content: "summary" },
];

/**
 * Enhanced conversions: give the Google tag the lead's email and phone before the
 * conversion fires. The tag hashes them (SHA-256) in the browser; Google never gets
 * them in plain text. Helps match conversions that cookies miss (e.g. iPhones).
 */
export function setEnhancedUserData(email: unknown, phone: unknown) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  const data: Record<string, string> = {};
  if (typeof email === "string" && email) data["email"] = email.trim().toLowerCase();
  if (typeof phone === "string") {
    const d = phone.replace(/[^\d+]/g, "").replace(/^00/, "+");
    const e164 = d.startsWith("+") ? d : d.startsWith("0") ? "+971" + d.slice(1) : "+971" + d;
    if (e164.length >= 11) data["phone_number"] = e164;
  }
  if (Object.keys(data).length) w.gtag?.("set", "user_data", data);
}
