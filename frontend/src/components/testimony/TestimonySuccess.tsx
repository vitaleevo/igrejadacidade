import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export function TestimonySuccess() {
  return <section lang="en" aria-labelledby="testimony-success-title" className="py-8 text-center">
    <CheckCircle2 className="mx-auto h-14 w-14 text-[#0b3b82]" aria-hidden="true" />
    <h2 id="testimony-success-title" className="mt-6 font-sans text-3xl font-bold leading-tight text-[#071a3d] sm:text-4xl">Thank you for sharing your testimony! <span aria-label="love">❤️</span></h2>
    <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-[var(--muted)]">We have received your story. Our team will review it and, if necessary, contact you for additional information.</p>
    <Link href="/" className="primary-cta mt-8">Back to Home</Link>
  </section>;
}
