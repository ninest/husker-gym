import { prisma } from "@/db/prisma";
import { getUtcToEstDayHour, serializeListWithDate } from "@/utils/date";
import { addHours, subWeeks } from "date-fns";
import { addDays } from "date-fns/esm";
import { DayBarChart } from "./components/DayBarChart";
import { WeekHeatMap } from "./components/WeekHeatMap";

export const revalidate = 0; // no cache

export default async function SectionPage({
  params,
}: {
  params: { sectionSlug: string };
}) {
  const section = await prisma.section.findFirst({
    where: { slug: params.sectionSlug },
  });
  const records = await prisma.record.findMany({
    where: {
      section_id: section?.id,
      // By default, use data from the past three weeks in calculation
      time: { lte: addDays(new Date(), 1), gte: subWeeks(new Date(), 3) },
    },
    orderBy: { time: "desc" },
  });

  // TODO: section invalid, show error

  const today = getUtcToEstDayHour(new Date());

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      <h1 className="font-bold text-2xl mb-2">{section?.name}</h1>
      <div className="mb-8">{section?.description}</div>

      <div className="mb-8">
        <DayBarChart />
      </div>

      {/* <WeekHeatMap
        section={section!}
        serializedRecords={serializeListWithDate(records, "time")}
        today={today}
      /> */}
    </main>
  );
}
