"use client";

import { BAR_CHART_COLORS } from "@/style/colors";
import { DayHour } from "@/types";
import {
  parseListWithDate,
  twentyFourHourToShortAMPMHour,
  utcToEst,
} from "@/utils/date";
import { getAveragePercent } from "@/utils/records";
import { record } from "@prisma/client";
import clsx from "clsx";
import { scaleBand, scaleLinear } from "d3-scale";
import useMeasure from "react-use-measure";

interface DayBarChartProps {
  serializedRecords: record[];
  today: DayHour;
}

export const DayBarChart = ({ serializedRecords, today }: DayBarChartProps) => {
  const [ref, bounds] = useMeasure();
  const records = parseListWithDate(serializedRecords, "time");

  return (
    <div className="relative w-full h-96" ref={ref}>
      <DayBarChartInner
        records={records}
        today={today}
        width={bounds.width}
        height={bounds.height}
      />
    </div>
  );
};

interface DataPoint {
  hour: number; // 5 to 23
  percent: number;
}

const DayBarChartInner = ({
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
  const margin = { top: 10, bottom: 20, left: 10, right: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const data: DataPoint[] = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ].map((hour) => {
    // TODO: use today by default, but this should be customizable
    let percent = getAveragePercent({ records, day: today.day, hour });
    if (percent == 0 || isNaN(percent)) percent = 2; // minimum 2% to show bar
    return { hour, percent };
  });

  // This is the current live count (NOT averaged)
  const lastRecord = records[0];
  const livePercent = lastRecord.percent;
  const liveTime = lastRecord.time;

  const getX = (d: DataPoint) => d.hour;
  const getY = (d: DataPoint) => d.percent;

  const xScale = scaleBand()
    .range([0, xMax])
    .domain(data.map(getX))
    .padding(0.15);

  const maxPercent = Math.max(...data.map(getY), livePercent);
  const yScale = scaleLinear().range([yMax, 0]).domain([0, maxPercent]);

  const xTicks = [6, 9, 12, 15, 18, 21];

  return (
    <svg width={width} height={height}>
      {/* Bars */}
      {data.map((d) => {
        const x = getX(d); // hour
        let y = getY(d) ?? 0; // percent

        const barWidth = xScale.bandwidth();
        const barHeight = yMax - yScale(getY(d) ?? 0);
        const barX = xScale(getX(d));
        const barY = yMax - barHeight;

        // Show the time ticker (x axis) every 3 ticks (6a, 9a, ...)
        const showTime = xTicks.includes(x);

        // Uhh
        const isNow = x == liveTime.getUTCHours(); // actually gets EST time because of conversion

        // height diff in estimated count now and actual count now
        const liveBarHeight = yMax - yScale(livePercent ?? 0);
        const barHeightDiff = barHeight - liveBarHeight;

        return (
          <g key={x}>
            <rect
              rx={4}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              className={`fill-current ${BAR_CHART_COLORS.DEFAULT}`}
            />

            {/* If the last record is this hour, overlay it and display the current crowded level color */}
            {isNow && (
              <rect
                rx={4}
                x={barX}
                y={barY + barHeightDiff}
                width={barWidth}
                height={liveBarHeight}
                className={clsx(`fill-current`, {
                  [BAR_CHART_COLORS.NORMAL]: y < 40,
                  [BAR_CHART_COLORS.BUSY]: y >= 40 && y < 60,
                  [BAR_CHART_COLORS.CROWDED]: y >= 60 && y < 80,
                  [BAR_CHART_COLORS.VERY_CROWDED]: y >= 80 && y < 200,
                })}
              />
            )}

            {showTime && (
              <text
                className="text-sm font-medium text-gray-400 fill-current"
                x={barX + barWidth / 2}
                y={height - 10}
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
      <text
        x={width - 55}
        y={yScale(50)}
        className="text-xs font-medium text-gray-400 fill-current"
        alignmentBaseline="middle"
      >
        50% full
      </text>

      {/* Only show 100 if there is a record with showing 110% capacity */}
      {maxPercent > 100 && (
        <>
          <line
            x1={0}
            x2={width - margin.right}
            y1={yScale(100)}
            y2={yScale(100)}
            className="stroke-gray-500"
            strokeDasharray={"5,5"}
          />
          <text
            x={width - 55}
            y={yScale(100)}
            className="text-xs font-medium text-gray-400 fill-current"
            alignmentBaseline="middle"
          >
            100% full
          </text>
        </>
      )}
    </svg>
  );
};
