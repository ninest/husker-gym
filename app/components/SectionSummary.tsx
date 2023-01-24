import { prisma } from "@/db/prisma";
import { bostonTime, lastUpdated } from "@/utils/date";
import Link from "next/link";

export const SectionSummary = async ({ id }: { id: number }) => {
  const section = await prisma.section.findFirst({
    where: { id },
  });

  // Remove the "Marino " or "Squashbusters " to make the name less verbose
  const shortenedSectionName = section?.name.substring(
    section.name.indexOf(" ") + 1
  );

  // Find latest count to show current time
  const latestRecord = await prisma.record.findFirst({
    where: { section_id: id },
    orderBy: {
      time: "desc",
    },
  });

  return (
    <Link
      href={`/${section?.slug}`}
      className="block rounded-lg p-3 bg-gray-50 hover:bg-gray-100"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{shortenedSectionName}</h3>
          <div className="text-sm text-gray-500">
            {lastUpdated(latestRecord?.time!)}
          </div>
        </div>
        <div className="text-right">
          <div>{latestRecord?.count} people</div>
          <div>{latestRecord?.percent}% full</div>
        </div>
      </div>
    </Link>
  );
};
