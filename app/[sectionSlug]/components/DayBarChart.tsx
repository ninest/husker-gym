"use client";

import { DayHour } from "@/types";
import {
  parseListWithDate,
  twentyFourHourToShortAMPMHour,
  utcToEst,
} from "@/utils/date";
import { getAveragePercent } from "@/utils/records";
import { record } from "@prisma/client";
import clsx from "clsx";
import { axisBottom } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import useMeasure from "react-use-measure";

interface DayBarChartProps {
  serializedRecords: record[];
  today: DayHour;
}

export const DayBarChart = ({ serializedRecords, today }: DayBarChartProps) => {
  const [ref, bounds] = useMeasure();
  const records = parseListWithDate(serializedRecords, "time").map(
    (record) => ({ ...record, time: utcToEst(record.time) })
  );

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
  const margin = { top: 10, bottom: 20, left: 10, right: 10 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const data: DataPoint[] = [
    5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ].map((hour) => {
    // TODO: use today by default, but this should be customizable
    let percent = getAveragePercent({ records, day: today.day, hour });
    if (isNaN(percent)) percent = 0;
    return { hour, percent };
  });

  const getX = (d: DataPoint) => d.hour;
  const getY = (d: DataPoint) => d.percent;

  const xScale = scaleBand()
    .range([0, xMax])
    .domain(data.map(getX))
    .padding(0.1);

  const yScale = scaleLinear()
    .range([yMax, 0])
    .domain([0, Math.max(...data.map(getY))]);

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

        const showTime = xTicks.includes(x);

        return (
          <g key={x}>
            <rect
              rx={6}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              className={clsx("fill-current text-gray-300", {
                "text-blue-300": x == today.hour,
              })}
            />

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
    </svg>
  );
};
