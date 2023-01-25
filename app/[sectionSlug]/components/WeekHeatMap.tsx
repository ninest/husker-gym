"use client";

import { DAYS, HOURS, twentyFourHourToAMPMHour } from "@/date/display";
import {
  parseListWithDate
} from "@/date/utils";
import { getHourColorFromPercent } from "@/style/colors";
import { DayHour } from "@/types";
import {
  getAverageCount,
  getAveragePercent, getFilteredRecords
} from "@/utils/records";
import { record, section } from "@prisma/client";
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";

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
      <div className="mb-8 bg-gray-50 -m-2 p-2 rounded-xl">
        {/* First row, days */}
        <div className="grid grid-cols-week gap-2 mb-3">
          <div></div>
          {DAYS.map((day, dayIndex) => (
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
        <div className="space-y-2">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-week gap-2">
              <div
                className={clsx("text-sm text-right pr-1 tabular-nums", {
                  "bg-green-200 rounded-md": today.hour == hour,
                })}
              >
                {twentyFourHourToAMPMHour(hour)}
              </div>

              {DAYS.map((day, dayIndex) => {
                const isNow = dayIndex == today.day && hour == today.hour;
                const averagePercentFull = getAveragePercent({
                  records,
                  day: dayIndex,
                  hour,
                });
                const bgClass = getHourColorFromPercent(averagePercentFull);
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
                    On {DAYS[selectedDayHour.day].name} at{" "}
                    {selectedDayHour.hour}
                    :00, {section.name} usually has{" "}
                    <span className="font-bold">
                      {getAverageCount({ records, ...selectedDayHour })} people
                    </span>{" "}
                    and is{" "}
                    <span className="font-bold">
                      {getAveragePercent({ records, ...selectedDayHour })}% full
                    </span>
                    .
                  </p>

                  <p className="">In the past weeks,</p>
                  <ul className="text-sm list-disc list-outside ml-5">
                    {getFilteredRecords({ records, ...selectedDayHour }).map(
                      (record) => (
                        <li>
                          On {format(record.time, "EEEE, LLLL d 'at' HH:mm")},{" "}
                          {section.name} had{" "}
                          <span className="font-bold">
                            {record.count} people
                          </span>{" "}
                          and was{" "}
                          <span className="font-bold">
                            {record.percent}% full
                          </span>
                          .
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="">
                  There is no valid data for {section.name} on{" "}
                  {DAYS[selectedDayHour.day].name} at {selectedDayHour.hour}
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
