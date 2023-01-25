import { getRecentRecords, getSectionBySlug } from "@/db/functions";
import { prisma } from "@/db/prisma";
import {
  getUtcToEstDayHour,
  serializeListWithDate,
  utcToEst,
} from "@/date/utils";
import { subWeeks } from "date-fns";
import { addDays } from "date-fns/esm";
import { DayBarChart } from "./components/DayBarChart";
import { WeekHeatMap } from "./components/WeekHeatMap";

export const revalidate = 0; // no cache

interface SectionPageProps {
  params: { sectionSlug: string };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const section = await getSectionBySlug(params.sectionSlug);
  const records = await getRecentRecords({
    sectionId: section?.id!,
    daysBack: 3 * 7,
  });

  // TODO: section invalid, show error

  // This is always run on the server
  const today = getUtcToEstDayHour(new Date());
  const serializedRecords = serializeListWithDate(records, "time");

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      <h1 className="font-bold text-2xl mb-2">{section?.name}</h1>
      <div className="mb-8">{section?.description}</div>

      <div className="mb-8">
        <DayBarChart serializedRecords={serializedRecords} today={today} />
      </div>

      <WeekHeatMap
        section={section!}
        serializedRecords={serializedRecords}
        today={today}
      />
    </main>
  );
}
