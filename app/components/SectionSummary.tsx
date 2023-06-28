import { lastUpdated } from "@/date/display";
import { estToUtc, getUtcToEstDayHour, serializeListWithDate } from "@/date/utils";
import { getRecentRecords, getSectionBySlug } from "@/db/functions";
import { crowdLevelDescription } from "@/string";
import { getTextBgColor } from "@/style/colors";
import { formatOrdinals } from "@/utils/numbers";
import { section } from "@prisma/client";
import clsx from "clsx";
import Link from "next/link";
import { CompactDayBarChart } from "./CompactDayBarChart";

const floorMap: Record<section["slug"], number> = {
  "marino-weight-room": 3,
  "marino-select-cardio": 3,
  "marino-strength-select": 3,
};

export const SectionSummary = async ({ slug }: { slug: string }) => {
  const section = await getSectionBySlug(slug);

  if (!section) throw Error("Invalid section");

  // Remove the "Marino " or "Squashbusters " to make the name less verbose
  const shortenedSectionName = section?.name.substring(section.name.indexOf(" ") + 1);

  const records = await getRecentRecords({
    sectionId: section?.id!,
    // four weeks
    daysBack: 4 * 7,
  });

  const lastRecord = records[0];
  const lastRecordTime = lastRecord ? estToUtc(lastRecord.time) : null;
  const today = lastRecordTime ? getUtcToEstDayHour(lastRecordTime) : null;

  const serializedRecords = serializeListWithDate(records, "time");

  const showFloor = Object.keys(floorMap).includes(slug);

  return (
    <Link href={`/${section.slug}`} className="block">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h3>
            <span className="font-medium dark:text-gray-200">{shortenedSectionName}</span>
            {showFloor && (
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                {formatOrdinals(floorMap[section.slug])} floor
              </span>
            )}
          </h3>

          {!lastRecord && <div className="mt-1 text-xs text-gray-500">No data available</div>}

          {lastRecord && lastRecordTime && (
            <>
              <div className="text-sm">
                <span
                  className={clsx(
                    "font-semibold rounded py-[0.2px] px-0.5",
                    "dark:text-gray-300",
                    getTextBgColor(lastRecord.percent)
                  )}
                >
                  Live
                </span>
                <span>{" "}{crowdLevelDescription(lastRecord.percent)}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">{lastUpdated(lastRecordTime)}</div>
            </>
          )}
        </div>
        {today && (
          <CompactDayBarChart serializedRecords={serializedRecords} today={today} className="w-1/3 h-[4.5rem]" />
        )}
      </div>
    </Link>
  );
};
