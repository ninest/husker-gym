import { prisma } from "@/db/prisma";
import { getUtcToEstDayHour, serializeListWithDate } from "@/utils/date";
import { subWeeks } from "date-fns";
import { WeekHeatMap } from "./components/WeekHeatMap";

export const revalidate = 60; // revalidate this page every 60 seconds

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
      time: { lte: new Date(), gte: subWeeks(new Date(), 3) },
    },
    orderBy: { time: "desc" },
  });

  // TODO: section invalid, show error

  const today = getUtcToEstDayHour(new Date());

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      <h1 className="font-bold text-2xl mb-3">{section?.name}</h1>
      <div className="mb-3">{section?.description}</div>

      <WeekHeatMap
        section={section!}
        serializedRecords={serializeListWithDate(records, "time")}
        today={today}
      />
    </main>
  );
}
