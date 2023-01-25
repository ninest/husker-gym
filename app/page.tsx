import { getGyms } from "@/db/functions";
import { SectionSummary } from "./components/SectionSummary";

export const revalidate = 0; // no cache

export default async function HomePage() {
  const gyms = await getGyms();

  return (
    <main className="max-w-[60ch] mx-auto p-7">
      {gyms.map((gym) => (
        <section key={gym.id} className="mb-8">
          <h2 className="font-bold text-2xl mb-3">{gym.name}</h2>

          <div className="space-y-4 -mx-1">
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
