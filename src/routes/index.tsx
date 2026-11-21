import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Check, Phone, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LeadForm } from "@/components/sps/LeadForm";
import { Logo, PhoneLink, WhatsAppButton, WhatsAppIcon } from "@/components/sps/Shared";
import { REVIEWS, type Review } from "@/lib/reviews";
import { ADDRESS, GOOGLE_ADS_PHONE_LABEL, GOOGLE_ADS_WHATSAPP_LABEL, PHONE_TEL, TOPICS, URL_TOPIC_TO_FORM, WHATSAPP_URL, adsConversion, captureAttribution, headlineFor, noindexMeta, pushEvent } from "@/lib/sps";

const GOOGLE_RATING = "4.9";
const GOOGLE_REVIEWS = "462";
// WebP versions of the hero photos (about 30-40 KB each instead of ~120 KB PNG).
// [file, width, height]
const SLIDES = [
  ["SPS-2.webp", 567, 426],
  ["SPS-1.webp", 563, 461],
  ["SPS-3.webp", 593, 400],
] as const;

// Figures published on the SPS founder page (solomonpeoplesolutions.com/founder).
const NUMBERS = [
  ["30+", "Years of experience"],
  ["5,000+", "Leaders and professionals developed"],
  ["500+", "Consulting and learning engagements"],
  ["15+", "Countries served"],
] as const;

const CREDENTIALS = [
  "CPD Certified Master Trainer for Trainers, UK",
  "Advisor for the Investors in People (IIP) Award, UK",
  "Certified Trainer, John Adair's Action Centred Leadership, UK",
  "Certified Tutor for Institute of Leadership & Management courses, UK",
  "Certified Predictive Index Analyst, USA",
] as const;

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
  { title: TOPICS[3], points: ["CPD accredited Train the Trainer certificate", "Present with confidence and handle difficult participants", "Design and deliver engaging sessions"] },
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
  // Read ?topic= on the server too, so the right headline is in the first HTML
  // (no headline swap after load). Other params (gclid, utm_*, section) are kept as-is.
  validateSearch: (s: Record<string, unknown>): Record<string, unknown> & { topic?: string | undefined } => ({
    ...s,
    topic: typeof s["topic"] === "string" ? s["topic"] : undefined,
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
  // Only the first photo is in the initial HTML; the other two are added after the
  // page has loaded, so they don't compete with the first one on slow phones.
  const [showRest, setShowRest] = useState(false);
  useEffect(() => {
    const show = () => setShowRest(true);
    if (document.readyState === "complete") show();
    else window.addEventListener("load", show, { once: true });
    return () => window.removeEventListener("load", show);
  }, []);
  useEffect(() => {
    if (!showRest || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, [showRest]);
  return (
    <>
      {SLIDES.map(([f, w, h], i) =>
        i === 0 || showRest ? (
          <img
            key={f}
            src={`/corporate-training-lp/${f}`}
            alt=""
            aria-hidden
            width={w}
            height={h}
            decoding="async"
            fetchPriority={i === 0 ? "high" : "low"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === active ? "opacity-100" : "opacity-0"}`}
          />
        ) : null,
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.15_0.03_262)]/85 via-[oklch(0.15_0.03_262)]/55 to-[oklch(0.15_0.03_262)]/10" />
    </>
  );
}

/** Counts up to a figure like "5,000+" the first time it scrolls into view. */
function CountUp({ value }: { value: string }) {
  const target = Number(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, "");
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1600);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(Math.round(target * eased).toLocaleString("en-US") + suffix);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setShown("0" + suffix);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, suffix]);
  return <span ref={ref}>{shown}</span>;
}

// The review slider renders ~100 cards (each review twice, for the loop). Drawing the
// star and Google icons inline in every card made the page HTML ~400 KB heavier, so the
// cards reuse one shared copy of each icon (<symbol> + <use>). Same look.
const STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function ReviewIconSprite() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <symbol id="sps-star" viewBox="0 0 24 24">
        <path d={STAR_PATH} fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sps-google" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </symbol>
    </svg>
  );
}

function CardStars() {
  return (
    <span className="flex text-highlight" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="h-4 w-4">
          <use href="#sps-star" />
        </svg>
      ))}
    </span>
  );
}

function ReviewCard({ r }: { r: Review }) {
  return (
    <figure className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-border bg-card p-6 md:w-[340px]">
      <div className="flex items-center justify-between">
        <CardStars />
        <svg className="h-5 w-5 shrink-0" aria-label="Google review" role="img">
          <use href="#sps-google" />
        </svg>
      </div>
      <blockquote className="mt-4 line-clamp-6 flex-1 text-[15px] leading-relaxed text-foreground">"{r.text}"</blockquote>
      <figcaption className="mt-4 text-sm">
        <span className="font-semibold text-foreground">{r.name}</span>
        <span className="text-muted-foreground"> · {r.date}</span>
      </figcaption>
    </figure>
  );
}

const TOPIC_MATCH: Record<string, Review["topic"]> = { leadership: "leadership", sales: "sales", hr: "ttt" };

function ReviewMarquee({ topic }: { topic: string }) {
  const match = TOPIC_MATCH[topic];
  const ordered = match ? [...REVIEWS.filter((r) => r.topic === match), ...REVIEWS.filter((r) => r.topic !== match)] : REVIEWS;
  // One sliding row with every review (topic-matched reviews first).
  const rows = [ordered];
  return (
    <div className="review-marquee mt-10 space-y-6">
      <ReviewIconSprite />
      <style>{`
        @keyframes sps-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .review-marquee .track { animation: sps-marquee 280s linear infinite; }
        .review-marquee .track.reverse { animation-direction: reverse; }
        .review-marquee:hover .track { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .review-marquee .track { animation: none; }
          .review-marquee .row { overflow-x: auto; }
        }
      `}</style>
      {rows.map((row, i) => (
        <div key={i} className="row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className={`track flex w-max gap-6 ${i === 1 ? "reverse" : ""}`}>
            {[...row, ...row].map((r, k) => (
              <div key={k} aria-hidden={k >= row.length}>
                <ReviewCard r={r} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Index() {
  const { topic: urlTopic } = Route.useSearch();
  const key = (urlTopic ?? "").toLowerCase();
  const headline = headlineFor(urlTopic);
  const topicKey = key;
  const [topic, setTopic] = useState(URL_TOPIC_TO_FORM[key] ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    captureAttribution();
  }, []);

  const [exitOpen, setExitOpen] = useState(false);

  const markEngaged = () => {
    try {
      sessionStorage.setItem("sps_exit_shown", "1");
    } catch {}
  };

  const openForm = (t?: string) => {
    if (t) setTopic(t);
    markEngaged();
    setOpen(true);
  };

  // Exit popup: laptop and desktop only, once per visit, after 5 seconds on the page.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let armed = false;
    const timer = setTimeout(() => (armed = true), 5000);
    const onLeave = (e: MouseEvent) => {
      if (!armed || e.relatedTarget || e.clientY > 0) return;
      try {
        if (sessionStorage.getItem("sps_exit_shown")) return;
        sessionStorage.setItem("sps_exit_shown", "1");
      } catch {}
      document.removeEventListener("mouseout", onLeave);
      setExitOpen(true);
    };
    document.addEventListener("mouseout", onLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, []);

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
            {/* Phones only: the header number is hidden below the sm breakpoint. */}
            <a
              href={PHONE_TEL}
              onClick={() => {
                pushEvent({ event: "phone_click" });
                adsConversion(GOOGLE_ADS_PHONE_LABEL);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/80 px-8 py-4 text-base font-semibold text-white hover:bg-white hover:text-foreground sm:hidden"
            >
              <Phone className="h-5 w-5" />
              Call now
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

      {/* Our experience in numbers */}
      <section className="border-b border-border bg-card py-20" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-6xl px-5 text-center">
          <h2 className="font-display text-3xl md:text-4xl">Our experience in numbers</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Since 2006, SPS has helped organisations across the Middle East, Africa and Asia build stronger leaders and teams.
          </p>
          <dl className="mt-12 grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {NUMBERS.map(([n, label]) => (
              <div key={label} className="px-2">
                <dt className="sr-only">{label}</dt>
                <dd className="font-sans text-4xl font-extrabold tracking-tight text-primary md:text-6xl">
                  <CountUp value={n} />
                </dd>
                <dd className="mt-2 text-sm text-muted-foreground md:text-base">{label}</dd>
              </div>
            ))}
          </dl>
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

      {/* Founder credibility */}
      <section id="founder" className="scroll-mt-4 bg-[oklch(0.18_0.03_262)] py-20 text-white" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Led by Solomon Vijayanand</h2>
            <p className="mt-3 text-lg text-highlight">Founder and Managing Director, 30+ years in HR and training</p>
            <p className="mt-6 text-white/85">
              Solomon has spent more than three decades in HR consulting, organisational development and professional training, with work across the GCC, Asia, Africa and North America. His career includes Titan Watches, The Birla Group, BPL and Toyota Kirloskar. He founded SPS in Dubai in 2006.
            </p>
            <ul className="mt-6 space-y-2 text-white/85">
              {CREDENTIALS.map((c) => (
                <li key={c} className="flex gap-2">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-highlight" />
                  {c}
                </li>
              ))}
            </ul>
            <a
              href="https://www.solomonpeoplesolutions.com/founder"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block rounded-full border-2 border-white/80 px-6 py-3 font-semibold text-white hover:bg-white hover:text-foreground"
            >
              Read his full profile
            </a>
          </div>
          <img src="/corporate-training-lp/SPS-1.webp" alt="Solomon People Solutions certificate presentation" width={563} height={461} loading="lazy" decoding="async" className="w-full rounded-2xl object-cover shadow-2xl" />
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

      {/* What participants say: real Google reviews, scrolling */}
      <section id="testimonials" className="scroll-mt-4 overflow-hidden py-20" style={{ contentVisibility: "auto" }}>
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display text-3xl md:text-4xl">What participants say</h2>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-muted-foreground">
            <Stars /> {GOOGLE_RATING} on Google from {GOOGLE_REVIEWS} reviews
          </p>
        </div>
        <ReviewMarquee topic={topicKey} />
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
      <section id="contact" className="scroll-mt-4 bg-[oklch(0.18_0.03_262)] py-20">
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

      <Dialog open={exitOpen} onOpenChange={setExitOpen}>
        <DialogContent className="max-w-md rounded-2xl border-0 bg-card p-8 text-center">
          <DialogTitle className="font-display text-2xl font-normal text-foreground">Before you go</DialogTitle>
          <p className="text-muted-foreground">
            Get a tailored training proposal for your team. Tell us what you need and we reply within minutes during working hours.
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold">
            <Stars />
            <span>
              {GOOGLE_RATING} on Google from {GOOGLE_REVIEWS} reviews
            </span>
          </div>
          <button
            onClick={() => {
              setExitOpen(false);
              openForm();
            }}
            className="mt-4 w-full rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Yes, send me a proposal
          </button>
          <button onClick={() => setExitOpen(false)} className="text-sm text-muted-foreground underline hover:text-foreground">
            No thanks
          </button>
        </DialogContent>
      </Dialog>

      <WhatsAppButton floating />
    </div>
  );
}
