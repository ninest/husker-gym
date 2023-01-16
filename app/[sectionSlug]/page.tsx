import { prisma } from "@/db/prisma";
import { serializeListWithDate } from "@/utils/date";
import { subWeeks } from "date-fns";
import { WeekHeatMap } from "./components/WeekHeatMap";

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

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      <h1 className="font-black border-b text-3xl mb-2">{section?.name}</h1>
      <div className="mb-3">{section?.description}</div>

      <WeekHeatMap serializedRecords={serializeListWithDate(records, "time")} />
    </main>
  );
}
