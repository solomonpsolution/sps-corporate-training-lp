// Shared config and pure helpers for the Solomon People Solutions ads landing page.

// Tracking. Leave empty until the real IDs exist; nothing loads while empty.
export const GTM_ID = ""; // e.g. "GTM-ABC1234"
export const GOOGLE_ADS_ID = "AW-925863685";
export const GOOGLE_ADS_LEAD_LABEL = "8SiyCMiNoLYdEIWevrkD"; // SPS NEW CT LP - FORM SUBMIT (primary)
export const GOOGLE_ADS_WHATSAPP_LABEL = "qlVkCMuNoLYdEIWevrkD"; // SPS NEW CT LP - WHATSAPP CLICK (secondary)
export const GOOGLE_ADS_PHONE_LABEL = "R-RcCM6NoLYdEIWevrkD"; // SPS NEW CT LP - PHONE CLICK (secondary)

// Leads are emailed to LEAD_EMAIL through FormSubmit (formsubmit.co), with a copy to LEAD_CC.
// The first submission to a new LEAD_EMAIL sends an activation email to that inbox; click it once.
// Until it is activated, leads fall back to LEAD_CC (already active) so no enquiry is lost.
export const LEAD_EMAIL = "info@solomonpeoplesolutions.com";
export const LEAD_CC = "mercyget4@gmail.com";
export const ZOHO_BOOKINGS_URL = "https://PLACEHOLDER-zoho-bookings-link"; // PLACEHOLDER
export const WHATSAPP_NUMBER = "971552815948";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_DISPLAY = "+971 4 876 9263";
export const PHONE_TEL = "tel:+97148769263";
export const ADDRESS =
  "Office #51, 9th & 10th Floor, Crystal Tower, Millennium Central Downtown, Al Asayel St, Marasi Drive, Downtown Dubai, UAE";

export const TOPICS = [
  "Leadership and Management",
  "Sales and Customer Service",
  "Communication and Soft Skills",
  "Train the Trainer",
] as const;
export const TOPIC_OPTIONS = [...TOPICS, "Not sure yet"];
export const COMPANY_SIZES = ["1 to 50", "51 to 200", "201 to 500", "501 to 1,000", "1,000+"];

export const HEADLINES: Record<string, string> = {
  leadership: "When leadership slips, results follow. Training built for your managers in Dubai",
  sales: "Sales and customer service training that lifts team performance",
  hr: "CPD accredited Train the Trainer for HR and L&D teams in Dubai",
};
export const DEFAULT_HEADLINE = "Corporate Training built around your team";
export const URL_TOPIC_TO_FORM: Record<string, string> = {
  leadership: TOPICS[0],
  sales: TOPICS[1],
  hr: TOPICS[3],
};

export function headlineFor(topic: string | null | undefined) {
  return (topic && HEADLINES[topic.toLowerCase()]) || DEFAULT_HEADLINE;
}

const FREE_DOMAINS = ["gmail", "yahoo", "hotmail", "outlook", "icloud", "live"];
export function isFreeEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  const first = domain.split(".")[0];
  return FREE_DOMAINS.includes(first ?? "");
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
export const TRACK_KEYS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "topic"] as const;
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
  if (changed) {
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(current))}; max-age=${60 * 60 * 24 * 90}; path=/; SameSite=Lax`;
  }
  return current;
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
    body: JSON.stringify({
      _subject: `New training lead: ${lead["company"] ?? ""} (${lead["lead_quality"] ?? ""})`,
      _template: "table",
      _captcha: "false",
      _cc: cc,
      ...lead,
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  if (!res.ok || String(json.success) !== "true") throw new Error(json.message || `status ${res.status}`);
}

export async function sendLeadEmail(lead: Record<string, string>) {
  try {
    await postLead(LEAD_EMAIL, LEAD_CC, lead);
  } catch {
    // Main inbox not activated yet or temporarily failing: send to the backup inbox instead.
    await postLead(LEAD_CC, LEAD_EMAIL, lead);
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
