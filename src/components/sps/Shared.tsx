import { useEffect } from "react";
import { GOOGLE_ADS_LEAD_LABEL, GOOGLE_ADS_PHONE_LABEL, GOOGLE_ADS_WHATSAPP_LABEL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL, adsConversion, pushEvent } from "@/lib/sps";

export function Logo() {
  return (
    <img
      src="/corporate-training-lp/sps-logo.png"
      alt="Solomon People Solutions"
      width={159}
      height={54}
      className="h-8 w-auto md:h-10"
    />
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.1c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export function WhatsAppButton({ floating = false }: { floating?: boolean }) {
  const cls = floating
    ? "fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-primary-foreground shadow-lg md:hidden"
    : "inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-primary-foreground";
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => {
        pushEvent({ event: "whatsapp_click" });
        adsConversion(GOOGLE_ADS_WHATSAPP_LABEL);
      }}
      className={cls}
    >
      <WhatsAppIcon className={floating ? "h-7 w-7" : "h-5 w-5"} />
      {!floating && "Chat on WhatsApp"}
    </a>
  );
}

export function PhoneLink({ className = "" }: { className?: string }) {
  return (
    <a href={PHONE_TEL} onClick={() => {
        pushEvent({ event: "phone_click" });
        adsConversion(GOOGLE_ADS_PHONE_LABEL);
      }} className={className}>
      {PHONE_DISPLAY}
    </a>
  );
}

/** Thank-you page: fires the Google Ads lead conversion once per real submission. */
export function useThankYouEvent() {
  useEffect(() => {
    let stored: Record<string, unknown> = {};
    try {
      stored = JSON.parse(sessionStorage.getItem("sps_lead") || "{}");
      sessionStorage.removeItem("sps_lead");
    } catch {}
    if (!stored["training_topic"]) return; // page opened directly, not after a submission
    pushEvent({
      event: "thank_you_view",
      lead_quality: stored["lead_quality"],
      training_topic: stored["training_topic"],
      company_size: stored["company_size"],
    });
    adsConversion(GOOGLE_ADS_LEAD_LABEL);
  }, []);
}

export function SimpleShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto max-w-6xl px-5 py-5">
        <Logo />
      </header>
      <main className="mx-auto max-w-3xl px-5 pb-16">{children}</main>
      <WhatsAppButton floating />
    </div>
  );
}
