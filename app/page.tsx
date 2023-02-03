import { getGyms } from "@/db/functions";
import clsx from "clsx";
import { Navbar } from "./components/Navbar";
import { SectionSummary } from "./components/SectionSummary";

export const revalidate = 0; // no cache

export default async function HomePage() {
  const gyms = await getGyms();

  return (
    <>
      <Navbar />
      <main className="max-w-[60ch] mx-auto p-5 pt-4">
        {gyms.map((gym) => (
          <section key={gym.id} className="mb-6">
            <h2 className="font-bold text-lg -mb-2">{gym.name}</h2>
            <div className="divide-y dark:divide-gray-800">
              {gym.sections.map((section, index) => (
                <div key={section.id} className={"mt-2 py-2"}>
                  {/* @ts-expect-error Server Component */}
                  <SectionSummary slug={section.slug} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
