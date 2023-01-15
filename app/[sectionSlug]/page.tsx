import { prisma } from "@/db/prisma";
import { subWeeks } from "date-fns";

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

  // day is 0-indexed
  const getFilteredRecords = (day: number, hour: number) => {
    // Take into account for timezones
    const offsetHours = new Date().getTimezoneOffset() / 60;
    const filteredRecords = records.filter(
      (record) =>
        record.time.getDay() === day &&
        record.time.getHours() >= hour - offsetHours &&
        record.time.getHours() < hour - offsetHours + 1
    );
    return filteredRecords;
  };

  const getAverageCount = (day: number, hour: number) => {
    const filteredRecords = getFilteredRecords(day, hour);
    const sum = filteredRecords.reduce((acc, rec) => acc + rec.count, 0);
    return sum / filteredRecords.length;
  };
  const getAveragePercent = (day: number, hour: number) => {
    const filteredRecords = getFilteredRecords(day, hour);
    const sum = filteredRecords.reduce((acc, rec) => acc + rec.percent, 0);
    return sum / filteredRecords.length;
  };

  const days = [
    { name: "Sunday", shortName: "Sun", singleChar: "S" },
    { name: "Monday", shortName: "Mon", singleChar: "M" },
    { name: "Tuesday", shortName: "Tue", singleChar: "T" },
    { name: "Wednesday", shortName: "Wed", singleChar: "W" },
    { name: "Thursday", shortName: "Thu", singleChar: "R" },
    { name: "Friday", shortName: "Fri", singleChar: "F" },
    { name: "Saturday", shortName: "Sat", singleChar: "S" },
  ];
  const times = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ];

  const percentColorClass = (percent: number) => {
    if (percent < 20) return "bg-blue-100";
    else if (percent < 40) return "bg-blue-300";
    else if (percent < 60) return "bg-blue-500";
    else if (percent < 80) return "bg-blue-700";
    else if (percent >= 80) return "bg-blue-900";
    else return ""
  };

  return (
    <main>
      <h1 className="font-black border-b text-3xl mb-2">{section?.name}</h1>
      <div>{section?.description}</div>

      {/* Weekly calendar heatmap */}
      <div className="max-w-[60ch] mx-auto p-5">
        {/* Row 0: days */}
        <div className="grid grid-cols-8 gap-2 mb-3">
          <div></div>
          {days.map((day) => (
            <div key={day.shortName} className="text-center">{day.singleChar}</div>
          ))}
        </div>

        {times.map((time) => (
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-right tabular-nums">
              <span>{time.toString().padStart(2, "0")}</span>
              <span>:00</span>
            </div>

            {days.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`rounded-md ${percentColorClass(
                  getAveragePercent(dayIndex, time)
                )}`}
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
