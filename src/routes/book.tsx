import { createFileRoute } from "@tanstack/react-router";
import { SimpleShell, WhatsAppButton, useThankYouEvent } from "@/components/sps/Shared";
import { ZOHO_BOOKINGS_URL, noindexMeta } from "@/lib/sps";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book your discovery call | Solomon People Solutions" },
      {
        name: "description",
        content: "Pick a time for a 20 minute discovery call with the SPS training team.",
      },
      { property: "og:title", content: "Book your discovery call | Solomon People Solutions" },
      { property: "og:description", content: "Pick a time for a 20 minute discovery call." },
      ...noindexMeta,
    ],
  }),
  component: Book,
});

function Book() {
  useThankYouEvent();
  return (
    <SimpleShell>
      <h1 className="mt-6 font-display text-3xl leading-tight md:text-4xl">
        Thank you, your request is in.
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Pick a time for a 20 minute discovery call with our training team.
      </p>
      {/* PLACEHOLDER: replace ZOHO_BOOKINGS_URL in src/lib/sps.ts with the real Zoho Bookings link */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          src={ZOHO_BOOKINGS_URL}
          title="Book a discovery call"
          className="h-[720px] w-full"
          loading="lazy"
        />
      </div>
      <div className="mt-8">
        <WhatsAppButton />
      </div>
    </SimpleShell>
  );
}
