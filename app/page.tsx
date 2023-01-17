import { prisma } from "@/db/prisma";
import { SectionSummary } from "./components/SectionSummary";

export default async function HomePage() {
  const gyms = await prisma.gym.findMany({
    include: { sections: { select: { id: true } } },
  });

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      {gyms.map((gym) => (
        <section key={gym.id} className="mb-8">
          <h2 className="font-bold text-2xl mb-3">{gym.name}</h2>

          <div className="space-y-4">
            {gym.sections.map((section) => (
              // @ts-expect-error Server Component
              <SectionSummary key={section.id} id={section.id} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
