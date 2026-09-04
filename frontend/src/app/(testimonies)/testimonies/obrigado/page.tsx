import { TestimonySuccess } from "@/components/testimony/TestimonySuccess";

export const metadata = { title: "After Submission", robots: { index: false, follow: false } };

export default function ObrigadoPage() {
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
    <h1 className="eyebrow text-center">After Submission</h1>
    {process.env.NEXT_PUBLIC_APPROVAL_PREVIEW === "true" && <p role="note" className="mt-6 border-l-4 border-[#0b3b82] bg-[#eef3fa] p-4 text-sm leading-6">Confirmation preview — no testimony has been submitted. This message is displayed after a successful submission on the connected site.</p>}
    <TestimonySuccess />
  </div>;
}
