import { prisma } from "@/db/prisma";
import { lastUpdated } from "@/date/display";
import Link from "next/link";
import { getRecentRecords, getSectionBySlug } from "@/db/functions";
import { getUtcToEstDayHour, serializeListWithDate } from "@/date/utils";
import { DayBarChart } from "../[sectionSlug]/components/DayBarChart";
import { CompactDayBarChart } from "./CompactDayBarChart";

export const SectionSummary = async ({ slug }: { slug: string }) => {
  const section = await getSectionBySlug(slug);

  // Remove the "Marino " or "Squashbusters " to make the name less verbose
  const shortenedSectionName = section?.name.substring(
    section.name.indexOf(" ") + 1
  );

  // Find latest count to show current time
  // const latestRecord = await prisma.record.findFirst({
  //   where: { section_id: id },
  //   orderBy: {
  //     time: "desc",
  //   },
  // });

  // This is always run on the server
  const today = getUtcToEstDayHour(new Date());
  const records = await getRecentRecords({ sectionId: section?.id! });
  const serializedRecords = serializeListWithDate(records, "time");

  return (
    <Link
      href={`/${section?.slug}`}
      className="block rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <div>{shortenedSectionName}</div>
        <CompactDayBarChart
          serializedRecords={serializedRecords}
          today={today}
          className="w-1/3 h-20"
        />
      </div>
      {/* <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{shortenedSectionName}</h3>
          <div className="text-sm text-gray-500">
            {lastUpdated(latestRecord?.time!)}
          </div>
        </div>

        <div>
          <DayBarChart
            serializedRecords={serializedRecords}
            today={today}
            className="w-1/2 h-96"
          />
        </div>

        <div className="text-right">
          <div>{latestRecord?.count} people</div>
          <div>{latestRecord?.percent}% full</div>
        </div>
      </div> */}
    </Link>
  );
};
