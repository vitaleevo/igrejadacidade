import { PageHero } from "@/components/shared/PageHero";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} accent="gold" />
      <section className="bg-[var(--ivory)] px-5 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-8 text-[var(--ink)]">{intro}</p>
          <p className="mt-3 text-sm text-slate-500">Última atualização: {updated}</p>
          <div className="mt-10 space-y-10">
            {sections.map((s, i) => (
              <section key={s.heading} aria-labelledby={`legal-${i}`}>
                <h2 id={`legal-${i}`} className="font-[family-name:var(--font-sora)] text-xl font-bold text-[var(--ink)]">
                  {i + 1}. {s.heading}
                </h2>
                {s.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-3 leading-7 text-slate-700">{p}</p>
                ))}
                {s.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-700">
                    {s.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
