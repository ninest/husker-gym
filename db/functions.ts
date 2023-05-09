import { utcToEst } from "@/date/utils";
import { addDays, subDays } from "date-fns";
import { prisma } from "./prisma";

// Fetch gyms and section IDs
export const getGyms = () =>
  prisma.gym.findMany({
    include: { sections: { select: { id: true, slug: true } } },
  });

export const getGym = (slug: string) =>
  prisma.gym.findFirst({
    where: { slug },
    include: { sections: { select: { id: true, slug: true } } },
  });

// Get a gym section from slug
export const getSectionBySlug = (slug: string) => prisma.section.findFirst({ where: { slug } });

// Get records (past `daysBack` days) for a gym section
interface GetRecentRecordsParams {
  sectionId: number;
  daysBack?: number;
}
export const getRecentRecords = async ({
  sectionId,
  daysBack = 4 * 7, // Default 4 weeks
}: GetRecentRecordsParams) => {
  // Get most recent records ...
  const now = addDays(new Date(), 1);
  // ... to records `daysBack` days back
  const limit = subDays(new Date(), daysBack);

  const records = (
    await prisma.record.findMany({
      where: { section_id: sectionId, time: { lte: now, gte: limit } },
      // Most recent last
      orderBy: { time: "desc" },
    })
  )
    /* 
    This is very hacky. Dates are stored in UTC, and when fetched, 5 hours are
    added to "convert" them to EST. While date.getDay and getHours return the
    day/hour in the users' local time, nextjs may run all components (client 
    components too) on the server or client. Even if "use client" is specified,
    the component is still rendered on the server.
    That's why I'm "converting" UTC to EST by adding 5 hours. getUTCDay and hours
    are used (see `getUtcToEstDayHour()`). So, UTC is "becoming" by subtracting time
    */
    .map((record) => ({ ...record, time: utcToEst(record.time) }));

  return records;
};
