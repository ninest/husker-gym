import { prisma } from "@/db/prisma";
import { lastUpdated } from "@/date/display";
import Link from "next/link";
import { getRecentRecords, getSectionBySlug } from "@/db/functions";
import {
  estToUtc,
  getUtcToEstDayHour,
  serializeListWithDate,
  utcToEst,
} from "@/date/utils";
import { DayBarChart } from "../[sectionSlug]/components/DayBarChart";
import { CompactDayBarChart } from "./CompactDayBarChart";

export const SectionSummary = async ({ slug }: { slug: string }) => {
  const section = await getSectionBySlug(slug);

  // Remove the "Marino " or "Squashbusters " to make the name less verbose
  const shortenedSectionName = section?.name.substring(
    section.name.indexOf(" ") + 1
  );

  const records = await getRecentRecords({ sectionId: section?.id! });

  const lastRecord = records[0];
  const today = getUtcToEstDayHour(estToUtc(lastRecord.time));

  const serializedRecords = serializeListWithDate(records, "time");

  return (
    <Link
      href={`/${section?.slug}`}
      className="block rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
    >
      <div className="flex justify-between">
        <div>
          <h3>{shortenedSectionName}</h3>
          <div className="text-sm text-gray-500">
            {lastUpdated(lastRecord?.time!)}
          </div>
        </div>
        <CompactDayBarChart
          serializedRecords={serializedRecords}
          today={today}
          className="w-1/3 h-20"
        />
      </div>
      {/* <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{shortenedSectionName}</h3>
          
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
