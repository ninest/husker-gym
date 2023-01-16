import { prisma } from "@/db/prisma";
import { bostonTime, lastUpdated } from "@/utils/date";
import Link from "next/link";

export const SectionSummary = async ({ id }: { id: number }) => {
  const section = await prisma.section.findFirst({ where: { id } });

  // Find latest count to show current time
  const latestRecord = await prisma.record.findFirst({
    where: { section_id: id },
    orderBy: {
      time: "desc",
    },
  });

  return (
    <Link href={`/${section?.slug}`}>
      <h3 className="font-bold">{section?.name}</h3>
      <div>{section?.description}</div>
      <div>
        Current count: {latestRecord?.count}, {latestRecord?.percent}% full
      </div>
      <div>{lastUpdated(latestRecord?.time!)}</div>
    </Link>
  );
};