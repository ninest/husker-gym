"use client";

import { twentyFourHourToShortAMPMHour } from "@/date/display";
import { parseListWithDate } from "@/date/utils";
import { BAR_CHART_COLORS, getBarColorFromPercent } from "@/style/colors";
import { DataPoint, DayHour } from "@/types";
import { getAveragePercent } from "@/utils/records";
import { record } from "@prisma/client";
import clsx from "clsx";
import { scaleBand, scaleLinear } from "d3-scale";
import useMeasure from "react-use-measure";

interface CompactDayBarChartProps {
  serializedRecords: record[];
  today: DayHour;
  className?: string;
}

export const CompactDayBarChart = ({
  serializedRecords,
  today,
  className,
}: CompactDayBarChartProps) => {
  const [ref, bounds] = useMeasure();
  const records = parseListWithDate(serializedRecords, "time");

  return (
    <div className={className} ref={ref}>
      <CompactDayBarChartInner
        records={records}
        today={today}
        width={bounds.width}
        height={bounds.height}
      />
    </div>
  );
};

export const CompactDayBarChartInner = ({
  width,
  height,
  records,
  today,
}: {
  width: number;
  height: number;
  records: record[];
  today: DayHour;
}) => {
  const margin = { top: 0, bottom: 15, left: 0, right: 0 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // Only show 1 hour before, current hour, and 2 hours after
  const hours = [
    today.hour - 2,
    today.hour - 1,
    today.hour,
    today.hour + 1,
    today.hour + 2,
  ];

  const data: DataPoint[] = hours.map((hour) => {
    let percent = getAveragePercent({ records, day: today.day, hour });
    if (isNaN(percent)) percent = 0;
    return { hour, percent };
  });

  // TODO: don't rely on the order of records to get the latest record
  const lastRecord = records[0];
  const livePercent = lastRecord.percent;
  const liveTime = lastRecord.time;

  const getX = (d: DataPoint) => d.hour;
  const getY = (d: DataPoint) => d.percent;

  const xScale = scaleBand()
    .range([0, xMax])
    // @ts-ignore
    .domain(data.map(getX))
    .padding(0.08);

  const maxPercent = Math.max(...data.map(getY), livePercent, 75);

  const yScale = scaleLinear()
    .range([yMax, 0])
    // Make chart a little taller than highest percent
    .domain([0, maxPercent + 10]);

  return (
    <svg width={width} height={height}>
      {/* Bars */}
      {data.map((d, index) => {
        const x = getX(d); //hour
        const y = getY(d) ?? 0; //percent

        const barWidth = xScale.bandwidth();
        const barHeight = yMax - yScale(getY(d) ?? 0);
        // @ts-ignore
        const barX = xScale(getX(d));
        const barY = yMax - barHeight;

        const isNow = x == liveTime.getUTCHours(); // actually gets EST time because of conversion

        // height diff in estimated count now and actual count now
        const liveBarHeight = yMax - yScale(livePercent ?? 0);
        const barHeightDiff = barHeight - liveBarHeight;

        return (
          <g key={x}>
            <rect
              rx={3}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              className={`fill-current ${BAR_CHART_COLORS.DEFAULT}`}
            />

            {/* If the last record is this hour, overlay it and display the current crowded level color */}
            {isNow && (
              <rect
                rx={3}
                x={barX}
                y={barY + barHeightDiff}
                width={barWidth}
                height={liveBarHeight}
                className={clsx(
                  `fill-current`,
                  getBarColorFromPercent(livePercent)
                )}
              />
            )}

            {/* Show ticks for every other */}
            {index % 2 == 0 && (
              <text
                className="text-xs font-medium text-gray-400 fill-current"
                // @ts-ignore
                x={barX + barWidth / 2}
                y={height - 5}
                textAnchor="middle"
              >
                {twentyFourHourToShortAMPMHour(x)}
              </text>
            )}
          </g>
        );
      })}
      {/* Guidelines */}
      <line
        x1={0}
        x2={width - margin.right}
        y1={yScale(50)}
        y2={yScale(50)}
        className="stroke-gray-500"
        strokeDasharray={"5,5"}
      />
      {/* Only show 100 if there is a record with showing 110% capacity */}
      {maxPercent > 100 && (
        <line
          x1={0}
          x2={width - margin.right}
          y1={yScale(100)}
          y2={yScale(100)}
          className="stroke-gray-500"
          strokeDasharray={"5,5"}
        />
      )}
    </svg>
  );
};
