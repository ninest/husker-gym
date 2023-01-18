"use client";

import { DayHour } from "@/types";
import { bostonTime, parseListWithDate, utcToEst } from "@/utils/date";
import { record, section } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { addHours } from "date-fns/esm";
import { useState } from "react";

export const WeekHeatMap = ({
  section,
  serializedRecords,
  today,
}: {
  section: section;
  serializedRecords: record[];
  today: DayHour;
}) => {
  // Convert UTC to EST client side
  const records = parseListWithDate(serializedRecords, "time").map(
    (record) => ({ ...record, time: utcToEst(record.time) })
  );

  // day is 0-indexed
  const getFilteredRecords = ({ day, hour }: DayHour) => {
    // Take into account for timezones
    const offsetHours = new Date().getTimezoneOffset() / 60;
    const hourTZ = hour - offsetHours;
    // const hourTZ = hour;
    const filteredRecords = records.filter(
      (record) =>
        record.time.getDay() === day &&
        record.time.getHours() >= hourTZ &&
        record.time.getHours() < hourTZ + 1
    );

    // Add offsetHours to each record
    const offsetRecords = filteredRecords.map((record) => ({
      ...record,
      time: addHours(record.time, offsetHours),
    }));
    return offsetRecords;
  };

  const getAverageCount = ({ day, hour }: DayHour) => {
    const filteredRecords = getFilteredRecords({ day, hour });
    const sum = filteredRecords.reduce((acc, rec) => acc + rec.count, 0);
    return sum / filteredRecords.length;
  };
  const getAveragePercent = ({ day, hour }: DayHour) => {
    const filteredRecords = getFilteredRecords({ day, hour });
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
  const hours = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 0,
  ];

  const [selectedDayHour, setSelectedDayHour] = useState<DayHour | null>(null);
  const validDataForDayHour = ({ day, hour }: DayHour) => {
    return !isNaN(getAverageCount({ day, hour }));
  };

  return (
    <div>
      <div className="mb-3 bg-gray-50 -m-2 p-2 rounded-xl">
        {/* First row, days */}
        <div className="grid grid-cols-8 gap-2 mb-3">
          <div></div>
          {days.map((day, dayIndex) => (
            <div
              key={day.shortName}
              className={clsx("text-center", {
                "bg-green-200 rounded-md": today.day == dayIndex,
              })}
            >
              {day.singleChar}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-3">
              <div
                className={clsx("text-sm text-right tabular-nums", {
                  "bg-green-200 rounded-md": today.hour == hour,
                })}
              >
                <span>{hour.toString().padStart(2, "0")}</span>
                <span className="text-gray-500">:00</span>
              </div>

              {days.map((day, dayIndex) => {
                const isNow = dayIndex == today.day && hour == today.hour;
                const averagePercentFull = getAveragePercent({
                  day: dayIndex,
                  hour,
                });
                const bgClass = percentColorClass(averagePercentFull);
                return (
                  <div
                    key={dayIndex}
                    className={clsx(`rounded-md`, bgClass, {
                      "ring-4 ring-green-400": isNow,
                    })}
                    onClick={() =>
                      setSelectedDayHour({ day: dayIndex, hour: hour })
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {selectedDayHour ? (
        <>
          <div className="">
            {validDataForDayHour(selectedDayHour) ? (
              <>
                <div className="space-y-3">
                  <p className="">
                    On {days[selectedDayHour.day].name} at{" "}
                    {selectedDayHour.hour}
                    :00, {section.name} usually has{" "}
                    <span className="font-bold">
                      {getAverageCount(selectedDayHour)} people
                    </span>{" "}
                    and is{" "}
                    <span className="font-bold">
                      {getAveragePercent(selectedDayHour)}% full
                    </span>
                    .
                  </p>

                  <p className="">In the past weeks,</p>
                  <ul className="text-sm list-disc list-outside ml-5">
                    {getFilteredRecords(selectedDayHour).map((record) => (
                      <li>
                        On {format(record.time, "EEEE, LLLL d 'at' HH:mm")},{" "}
                        {section.name} had{" "}
                        <span className="font-bold">{record.count} people</span>{" "}
                        and was{" "}
                        <span className="font-bold">
                          {record.percent}% full
                        </span>
                        .
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="font-medium">
                  There is no valid data for {section.name} on{" "}
                  {days[selectedDayHour.day].name} at {selectedDayHour.hour}
                  :00.
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 rounded-xl border-4 border-dashed">
          <div className="font-medium text-center text-gray-500">
            Click on a cell to get more information about the gym on that day
            and time.
          </div>
        </div>
      )}
    </div>
  );
};
