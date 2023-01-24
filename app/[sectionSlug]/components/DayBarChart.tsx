"use client";

import {
  parseListWithDate,
  twentyFourHourToShortAMPMHour,
  utcToEst,
} from "@/utils/date";
import { record } from "@prisma/client";
import { axisBottom } from "d3-axis";
import { scaleBand, scaleLinear } from "d3-scale";
import useMeasure from "react-use-measure";

interface DayBarChartProps {
  serializedRecords: record[];
}

export const DayBarChart = ({ serializedRecords }: DayBarChartProps) => {
  const [ref, bounds] = useMeasure();
  const records = parseListWithDate(serializedRecords, "time").map(
    (record) => ({ ...record, time: utcToEst(record.time) })
  );

  return (
    <div className="relative w-full h-96" ref={ref}>
      <DayBarChartInner
        records={records}
        width={bounds.width}
        height={bounds.height}
      />
    </div>
  );
};

const DayBarChartInner = ({
  width,
  height,
  records,
}: {
  width: number;
  height: number;
  records: record[];
}) => {
  const margin = { top: 10, bottom: 20, left: 10, right: 10 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const data = [
    [5, 1],
    [6, 2],
    [7, 3],
    [8, 6],
    [9, 5],
    [10, 5],
    [11, 6],
    [12, 7],
    [13, 6],
    [14, 5],
    [15, 5],
    [16, 4],
    [17, 8],
    [18, 9],
    [19, 10],
    [20, 9],
    [21, 9],
    [22, 8],
    [23, 5],
  ];

  const getX = (d: any) => d[0];
  const getY = (d: any) => d[1];

  const xScale = scaleBand()
    .range([0, xMax])
    .domain(data.map(getX))
    .padding(0.1);

  const yScale = scaleLinear()
    .range([yMax, 0])
    .domain([0, Math.max(...data.map(getY))]);

  const xAxis = axisBottom(xScale);
  const xTicks = [6, 9, 12, 15, 18, 21];

  return (
    <svg width={width} height={height}>
      {/* Bars */}
      {data.map((d) => {
        const x = getX(d);
        const barWidth = xScale.bandwidth();
        const barHeight = yMax - yScale(getY(d) ?? 0);
        const barX = xScale(getX(d));
        const barY = yMax - barHeight;

        // show xaxis tick
        const showTime = xTicks.includes(x);

        return (
          <g key={x}>
            <rect
              rx={6}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill="rgba(0,0,0,0.1)"
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
