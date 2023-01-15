import { prisma } from "@/db/prisma";
import { SectionSummary } from "./components/SectionSummary";

export default async function HomePage() {
  const gyms = await prisma.gym.findMany({
    include: { sections: { select: { id: true } } },
  });

  return (
    <main>
      {gyms.map((gym) => (
        <section key={gym.id} className="mb-5">
          <h2 className="font-black border-b text-2xl">{gym.name}</h2>

          <div className="space-y-2">
            {gym.sections.map((section) => (
              <SectionSummary key={section.id} id={section.id} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
