import { createFileRoute } from "@tanstack/react-router";
import { SimpleShell, WhatsAppButton, useThankYouEvent } from "@/components/sps/Shared";
import { noindexMeta } from "@/lib/sps";

export const Route = createFileRoute("/courses-thankyou")({
  head: () => ({
    meta: [
      { title: "Thank you | Solomon People Solutions" },
      { name: "description", content: "Your course enquiry has been received." },
      { property: "og:title", content: "Thank you | Solomon People Solutions" },
      { property: "og:description", content: "Your course enquiry has been received." },
      ...noindexMeta,
    ],
  }),
  component: CoursesThankYou,
});

function CoursesThankYou() {
  useThankYouEvent();
  return (
    <SimpleShell>
      <h1 className="mt-10 font-display text-3xl leading-tight md:text-4xl">Thank you, our team will reply within minutes during working hours.</h1>
      <div className="mt-8"><WhatsAppButton /></div>
    </SimpleShell>
  );
}
