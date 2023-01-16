"use client";

import { bostonTime, parseListWithDate } from "@/utils/date";
import { record } from "@prisma/client";
import clsx from "clsx";

export const WeekHeatMap = ({
  serializedRecords,
}: {
  serializedRecords: record[];
}) => {
  const records = parseListWithDate(serializedRecords, "time");

  // day is 0-indexed
  const getFilteredRecords = (day: number, hour: number) => {
    // Take into account for timezones
    const offsetHours = new Date().getTimezoneOffset() / 60;
    const hourTZ = hour - offsetHours;
    const filteredRecords = records.filter(
      (record) =>
        record.time.getDay() === day &&
        record.time.getHours() >= hourTZ &&
        record.time.getHours() < hourTZ + 1
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

  const percentColorClass = (percent: number) => {
    if (percent < 20) return "bg-blue-100";
    else if (percent < 40) return "bg-blue-300";
    else if (percent < 60) return "bg-blue-500";
    else if (percent < 80) return "bg-blue-700";
    else if (percent >= 80) return "bg-blue-900";
    else return "";
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
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23,
  ];

  // Highlight current day/time on heatmap
  const now = new Date();
  const currentDayIndex = now.getDay();
  const currentHour = now.getHours();

  console.log(currentDayIndex, currentHour);

  return (
    <div>
      {/* First row, days */}
      <div className="grid grid-cols-8 gap-2 mb-3">
        <div></div>
        {days.map((day, dayIndex) => (
          <div
            key={day.shortName}
            className={clsx("text-center", {
              "font-bold": currentDayIndex == dayIndex,
            })}
          >
            {day.singleChar}
          </div>
        ))}
      </div>

      {times.map((time) => (
        <div key={time} className="grid grid-cols-8 gap-1 mb-2">
          <div
            className={clsx("mr-2", "text-right tabular-nums", {
              "font-bold": time == currentHour,
            })}
          >
            <span>{time.toString().padStart(2, "0")}</span>
            <span className="text-gray-500">:00</span>
          </div>

          {days.map((day, dayIndex) => {
            const isNow = dayIndex == currentDayIndex && time == currentHour;
            return (
              <div
                key={dayIndex}
                className={clsx(
                  `rounded-md ${percentColorClass(
                    getAveragePercent(dayIndex, time)
                  )}`,
                  {
                    "ring-4 ring-opacity-50 ring-green-500": isNow,
                  }
                )}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
