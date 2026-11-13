import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LeadForm } from "@/components/sps/LeadForm";
import { Logo, PhoneLink, WhatsAppButton, WhatsAppIcon } from "@/components/sps/Shared";
import { ADDRESS, DEFAULT_HEADLINE, GOOGLE_ADS_WHATSAPP_LABEL, TOPICS, URL_TOPIC_TO_FORM, WHATSAPP_URL, adsConversion, captureAttribution, headlineFor, noindexMeta, pushEvent } from "@/lib/sps";

const GOOGLE_RATING = "4.9";
const GOOGLE_REVIEWS = "462";
const SLIDES = ["SPS-2.png", "SPS-1.png", "SPS-3.png"] as const;

const FAQS = [
  ["How long are the programmes?", "Programme length depends on your goals. We recommend the right format for your team in the proposal."],
  ["What do we receive before we commit?", "A tailored proposal with the course outline, materials, schedule and cost, so you know exactly what your team will get."],
  ["How many participants per session?", "Group size depends on the programme. We recommend the right size for your team in the proposal."],
  ["What happens after the training?", "We review progress against the baseline we agreed with you at the start, so you can see what improved."],
  ["How soon will you reply?", "We reply to your enquiry within minutes during working hours, then agree the programme and start date with you."],
] as const;

const PROGRAMMES = [
  { title: TOPICS[0], points: ["Lead and motivate teams with confidence", "Delegate, give feedback and coach", "Make decisions and manage priorities"] },
  { title: TOPICS[1], points: ["Understand customer needs and objections", "Build trust and close with structure", "Deliver consistent, standout service"] },
  { title: TOPICS[2], points: ["Communicate clearly in person and in writing", "Handle difficult conversations calmly", "Collaborate across teams and cultures"] },
  { title: TOPICS[3], points: ["CPD accredited Train the Trainer certificate", "Run a structured training needs analysis", "Design and deliver engaging sessions"] },
] as const;

const STEPS = [
  ["Discovery call", "We understand your goals and your team."],
  ["Training needs analysis", "We find the real skills gaps before we design anything."],
  ["Tailored proposal", "Course outline, materials, dates and cost, shared before you commit."],
  ["Training delivered", "Practical, interactive sessions led by expert trainers."],
  ["Measure results", "We agree a baseline and review progress after the training."],
] as const;

const WHY = [
  "Practical training your staff can use at work, not just theory",
  "Full course outline and materials shared before you commit",
  "Confirmed dates and timely communication at every step",
  "Support for your team during and after the training",
  "20 years training UAE teams (2006 to 2026)",
  "Led by founder Solomon Vijayanand, 30 years in HR and training",
  "CPD accredited Train the Trainer and Certified Training Function Manager",
] as const;

const TESTIMONIALS = [
  "The course, expertly led by Mr. Solomon, was not only highly informative but also incredibly engaging.",
  "The session was engaging, interactive and enjoyable. His excellent communication skills and ability to keep everyone involved made learning fun and meaningful. The session was full of valuable insights and practical knowledge.",
  "He explains everything clearly and makes learning easy and enjoyable. Very supportive, patient and motivating. Truly appreciate the guidance, knowledge and positive energy.",
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Corporate Training in Dubai | Solomon People Solutions" },
      { name: "description", content: "Corporate training built around your team: training needs analysis first, practical sessions by expert trainers, and measured results. Rated 4.9 on Google." },
      { property: "og:title", content: "Corporate Training in Dubai | Solomon People Solutions" },
      { property: "og:description", content: "Corporate training built around your team. Rated 4.9 on Google." },
      ...noindexMeta,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
        }),
      },
    ],
  }),
  component: Index,
});

function Stars() {
  return (
    <span className="flex text-highlight" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </span>
  );
}

function HeroSlides() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <>
      {SLIDES.map((f, i) => (
        <img
          key={f}
          src={`/corporate-training-lp/${f}`}
          alt=""
          aria-hidden
          fetchPriority={i === 0 ? "high" : "low"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.03_262)]/85 via-[oklch(0.15_0.03_262)]/55 to-[oklch(0.15_0.03_262)]/10" />
    </>
  );
}

function Index() {
  const [headline, setHeadline] = useState(DEFAULT_HEADLINE);
  const [topic, setTopic] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    captureAttribution();
    const t = new URLSearchParams(window.location.search).get("topic");
    setHeadline(headlineFor(t));
    if (t && URL_TOPIC_TO_FORM[t.toLowerCase()]) setTopic(URL_TOPIC_TO_FORM[t.toLowerCase()] ?? "");
  }, []);

  const openForm = (t?: string) => {
    if (t) setTopic(t);
    setOpen(true);
  };

  return (
    <div className="bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo />
        <div className="flex items-center gap-5">
          <PhoneLink className="hidden text-sm font-semibold text-foreground hover:text-primary sm:inline" />
          <button onClick={() => openForm()} className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            Get in touch
          </button>
        </div>
      </header>

      {/* Hero with sliding photos */}
      <section className="relative isolate overflow-hidden bg-[oklch(0.18_0.03_262)]">
        <HeroSlides />
        <div className="relative mx-auto flex min-h-[620px] max-w-6xl flex-col justify-center px-5 py-20 md:min-h-[680px]">
          <h1 className="max-w-3xl font-display text-3xl leading-tight text-white [text-shadow:0_2px_12px_rgb(0_0_0/0.55)] md:text-5xl">{headline}</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
            Many companies have paid for training that did not match what was promised. At SPS every programme is customised to your team, and it always starts with your real business needs. We measure the results after, so you can see what changed.
          </p>
          <ul className="mt-7 flex flex-col gap-3 text-white sm:flex-row sm:gap-7">
            {["We assess your team's needs first", "Practical, not just theory", "We reply within minutes"].map((c) => (
              <li key={c} className="flex items-center gap-2 font-medium">
                <Check className="h-5 w-5 text-highlight" />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button onClick={() => openForm()} className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90">
              Request a proposal
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                pushEvent({ event: "whatsapp_click" });
                adsConversion(GOOGLE_ADS_WHATSAPP_LABEL);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-foreground"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
          <figure className="mt-9 max-w-xl rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Stars />
              <span>
                {GOOGLE_RATING} on Google from {GOOGLE_REVIEWS} reviews
              </span>
            </div>
            <blockquote className="mt-3 text-white/85">"{TESTIMONIALS[0]}"</blockquote>
          </figure>
        </div>
      </section>

      {/* Programmes */}
      <section className="mx-auto max-w-6xl px-5 py-20" style={{ contentVisibility: "auto" }}>
        <h2 className="font-display text-3xl md:text-4xl">Programmes</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">Every programme is tailored after we understand your team's skills gaps.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PROGRAMMES.map((p) => (
            <article key={p.title} className="flex flex-col rounded-2xl border border-border bg-card p-7">
              <h3 className="font-display text-xl">{p.title}</h3>
              <ul className="mt-4 flex-1 space-y-2 text-muted-foreground">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    {pt}
                  </li>
                ))}
              </ul>
              <button onClick={() => openForm(p.title)} className="mt-6 self-start rounded-full border-2 border-primary px-5 py-2 font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                Request a proposal
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* How we work */}
      <section className="bg-card py-20" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl md:text-4xl">How we work</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Every programme starts with your real business needs, not a ready made course.</p>
          <ol className="mt-10 grid gap-6 md:grid-cols-5">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="rounded-2xl bg-background p-6">
                <span className="font-display text-3xl text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What participants say */}
      <section className="mx-auto max-w-6xl px-5 py-20" style={{ contentVisibility: "auto" }}>
        <h2 className="font-display text-3xl md:text-4xl">What participants say</h2>
        <p className="mt-3 flex items-center gap-2 text-muted-foreground">
          <Stars /> {GOOGLE_RATING} on Google from {GOOGLE_REVIEWS} reviews
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((q) => (
            <figure key={q} className="rounded-2xl border border-border bg-card p-7">
              <Stars />
              <blockquote className="mt-4 text-foreground">"{q}"</blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">SPS training participant</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Why SPS */}
      <section className="bg-card py-20" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl md:text-4xl">Why choose SPS?</h2>
          <ul className="mt-8 space-y-4">
            {WHY.map((w) => (
              <li key={w} className="flex gap-3 text-lg">
                <Check className="mt-1 h-5 w-5 shrink-0 text-primary" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="font-display text-3xl md:text-4xl">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left text-base font-semibold">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final section with the form on the page */}
      <section className="bg-[oklch(0.18_0.03_262)] py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-[1fr_1fr]">
          <div className="text-white">
            <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-highlight">
              <span className="h-px w-8 bg-highlight" />
              Contact us
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight md:text-5xl">Tell us what your team needs.</h2>
            <p className="mt-5 text-lg text-white/80">We design a training programme built around your goals and reply within minutes during working hours.</p>
            <p className="mt-6 text-white/80">
              Prefer to talk? Call <PhoneLink className="font-semibold text-white underline" />
            </p>
          </div>
          <LeadForm topic={topic} />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl space-y-1 px-5 py-10 pb-24 text-sm text-muted-foreground md:pb-10">
        <p className="font-semibold text-foreground">Solomon People Solutions</p>
        <p>{ADDRESS}</p>
        <p><PhoneLink className="hover:text-primary" /></p>
        <p><a href="/corporate-training-lp/privacy" className="underline hover:text-primary">Privacy policy</a></p>
      </footer>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Request a training proposal</DialogTitle>
          <LeadForm topic={topic} id="proposal-form-popup" />
        </DialogContent>
      </Dialog>

      <WhatsAppButton floating />
    </div>
  );
}
