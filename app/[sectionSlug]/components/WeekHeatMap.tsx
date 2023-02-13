"use client";

import { DAYS, HOURS, twentyFourHourToAMPMHour } from "@/date/display";
import { parseListWithDate } from "@/date/utils";
import { getHourColorFromPercent } from "@/style/colors";
import { DayHour } from "@/types";
import { roundToWhole } from "@/utils/numbers";
import {
  getAverageCount,
  getAveragePercent,
  getFilteredRecords,
} from "@/utils/records";
import { record, section } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import { SimpleBarCountChartProps } from "./SimpleBarCountChart";

interface WeekHeatMapProps {
  section: section;
  serializedRecords: record[];
  today: DayHour;
}

export const WeekHeatMap = ({
  section,
  serializedRecords,
  today,
}: WeekHeatMapProps) => {
  const records = parseListWithDate(serializedRecords, "time");

  const [selectedDayHour, setSelectedDayHour] = useState<DayHour | null>(null);
  const validDataForDayHour = ({ day, hour }: DayHour) => {
    return !isNaN(getAverageCount({ records, day, hour }));
  };

  return (
    <div>
      <div className="bg-gray-50 -m-2 p-2 rounded-xl dark:bg-black">
        {/* First row, days */}
        <div className="grid grid-cols-week gap-2 mb-3">
          <div></div>
          {DAYS.map((day, dayIndex) => (
            <div
              key={day.shortName}
              className={clsx("text-center font-medium text-gray-500", {
                "bg-green-200 rounded-md dark:bg-green-800":
                  today.day == dayIndex,
              })}
            >
              {day.singleChar}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-week gap-2">
              <div
                className={clsx(
                  "text-sm font-medium text-gray-500 text-right pr-1 tabular-nums",
                  {
                    "bg-green-200 rounded-md dark:bg-green-800":
                      today.hour == hour,
                  }
                )}
              >
                {twentyFourHourToAMPMHour(hour)}
              </div>

              {DAYS.map((day, dayIndex) => {
                const isNow = dayIndex == today.day && hour == today.hour;
                const isSelected =
                  dayIndex == selectedDayHour?.day &&
                  hour == selectedDayHour.hour;
                const averagePercentFull = getAveragePercent({
                  records,
                  day: dayIndex,
                  hour,
                });
                const bgClass = getHourColorFromPercent(averagePercentFull);
                return (
                  <div
                    key={dayIndex}
                    className={clsx(bgClass, {
                      // Highlight current time
                      "ring-4 ring-green-400": isNow,
                      // More rounded if selected
                      rounded: !isSelected,
                      "rounded-xl": isSelected,
                    })}
                    onClick={() =>
                      setSelectedDayHour({ day: dayIndex, hour: hour })
                    }
                    onMouseEnter={() =>
                      setSelectedDayHour({ day: dayIndex, hour: hour })
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {selectedDayHour ? (
          <>
            <div className="">
              {validDataForDayHour(selectedDayHour) ? (
                <>
                  <SimpleBarCountChartProps
                    records={records}
                    selectedDayHour={selectedDayHour}
                  />

                  <details>
                    <summary className="mt-5 text-sm text-gray-500 font-bold">
                      Show more details
                    </summary>{" "}
                    <div className="mt-2 space-y-3 dark:text-gray-300">
                      <p className="">
                        On {DAYS[selectedDayHour.day].name} at{" "}
                        {selectedDayHour.hour}
                        :00, {section.name} usually has{" "}
                        <span className="font-bold">
                          {roundToWhole(
                            getAverageCount({ records, ...selectedDayHour })
                          )}{" "}
                          people
                        </span>{" "}
                        and is{" "}
                        <span className="font-bold">
                          {roundToWhole(
                            getAveragePercent({ records, ...selectedDayHour })
                          )}
                          % full
                        </span>
                        .
                      </p>

                      <p className="">In the past weeks,</p>
                      <ul className="text-sm list-disc">
                        {getFilteredRecords({
                          records,
                          ...selectedDayHour,
                        }).map((record) => (
                          <li className="flex justify-between">
                            <div>
                              {format(record.time, "EEE, MMM d 'at' HH:mm")}
                            </div>

                            <div>
                              <span className="font-bold">
                                {roundToWhole(record.count)} people
                              </span>
                              ,{" "}
                              <span className="font-bold">
                                {roundToWhole(record.percent)}% full
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold text-gray-500">
                    There is no valid data for {section.name} on{" "}
                    {DAYS[selectedDayHour.day].name} at {selectedDayHour.hour}
                    :00.
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl border-4 border-dashed dark:border-gray-700">
            <div className="font-medium text-center text-gray-500">
              Click on a cell to get more information about the gym on that day
              and time.
            </div>
          </div>
        )}
      </div>

      {/* Extra space so the page doesn't jump around when something is clicked */}
      <div className="h-[80vh]" />
    </div>
  );
};
