import { prisma } from "@/db/prisma";

export default async function SectionPage({
  params,
}: {
  params: { sectionSlug: string };
}) {
  const section = await prisma.section.findFirst({
    where: { slug: params.sectionSlug },
  });

  const days = [
    { name: "Sunday", shortName: "Sun", singleChar: "S" },
    { name: "Monday", shortName: "Mon", singleChar: "M" },
    { name: "Tuesday", shortName: "Tue", singleChar: "T" },
    { name: "Wednesday", shortName: "Wed", singleChar: "W" },
    { name: "Thursday", shortName: "Thu", singleChar: "R" },
    { name: "Friday", shortName: "Fri", singleChar: "F" },
    { name: "Saturday", shortName: "Sat", singleChar: "S" },
  ];
  const times = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ];

  return (
    <main>
      <h1 className="font-black border-b text-3xl mb-2">{section?.name}</h1>
      <div>{section?.description}</div>

      {/* Weekly calendar heatmap */}
      <div>
        {/* Row 0: days */}
        <div className="grid grid-cols-8">
          <div></div>
          {days.map((day) => (
            <div key={day.shortName}>{day.singleChar}</div>
          ))}
        </div>

        {times.map((time) => (
          <div className="grid grid-cols-8">
            <div>{time}</div>

            {/* Data here */}
          </div>
        ))}
      </div>
    </main>
  );
}
