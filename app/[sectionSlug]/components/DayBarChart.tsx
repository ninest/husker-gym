"use client";

import { HOURS, twentyFourHourToShortAMPMHour } from "@/date/display";
import { parseListWithDate } from "@/date/utils";
import {
  BAR_CHART_COLORS,
  getBarColorFromPercent,
  getBarStrokeFromPercent,
} from "@/style/colors";
import { DataPoint, DayHour } from "@/types";
import { getAveragePercent } from "@/utils/records";
import { record } from "@prisma/client";
import clsx from "clsx";
import { scaleBand, scaleLinear } from "d3-scale";
import { useEffect } from "react";
import useMeasure from "react-use-measure";
import { useDataDisplay } from "../hooks/use-data-display";

interface DayBarChartProps {
  serializedRecords: record[];
  today: DayHour;
  className?: string;
}

export const DayBarChart = ({
  serializedRecords,
  today,
  className = "",
}: DayBarChartProps) => {
  const [ref, bounds] = useMeasure();
  const records = parseListWithDate(serializedRecords, "time");

  return (
    <div className={clsx(className)} ref={ref}>
      <DayBarChartInner
        records={records}
        today={today}
        width={bounds.width}
        height={bounds.height}
        showLiveHour={true}
      />
    </div>
  );
};

const DayBarChartInner = ({
  width,
  height,
  records,
  today,
  showLiveHour = false,
}: {
  width: number;
  height: number;
  records: record[];
  today: DayHour; // The day according to the bar chart
  showLiveHour?: boolean; // true if we want to highlight the current hour
}) => {
  const margin = { top: 10, bottom: 20, left: 10, right: 60 };
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const data: DataPoint[] = HOURS.map((hour) => {
    // TODO: use today by default, but this should be customizable
    let percent = getAveragePercent({ records, day: today.day, hour });
    if (percent == 0 || isNaN(percent)) percent = 2; // minimum 2% to show bar
    return { hour, percent };
  });

  // This is the current live count (NOT averaged)
  const lastRecord = records[0];
  const livePercent = lastRecord.percent;
  const liveTime = lastRecord.time;
  const currentHour = liveTime.getUTCHours();

  const getX = (d: DataPoint) => d.hour;
  const getY = (d: DataPoint) => d.percent;

  const xScale = scaleBand()
    .range([0, xMax])
    // @ts-ignore
    .domain(data.map(getX))
    .padding(0.15);

  const maxPercent = Math.max(...data.map(getY), livePercent);
  const yScale = scaleLinear()
    .range([yMax, 0])
    // Make chart a little taller than highest percent
    .domain([0, maxPercent + 10]);

  const xTicks = [6, 9, 12, 15, 18, 21];

  const { displayData, setDisplayData } = useDataDisplay();
  useEffect(() => {
    setDisplayData({
      day: today.day,
      hour: currentHour,
      percent: livePercent,
      isLive: true,
    });
  }, []);

  return (
    <svg width={width} height={height}>
      {/* Bars */}
      {data.map((d) => {
        const x = getX(d); // hour
        const y = getY(d) ?? 0; // percent

        const barWidth = xScale.bandwidth();
        const barHeight = yMax - yScale(getY(d) ?? 0);
        // @ts-ignore
        const barX = xScale(getX(d));
        const barY = yMax - barHeight;

        // Show the time ticker (x axis) every 3 ticks (6a, 9a, ...)
        const showTime = xTicks.includes(x);

        const isNow = x == currentHour; // actually gets EST time because of conversion

        // height diff in estimated count now and actual count now
        const liveBarHeight = yMax - yScale(livePercent ?? 0);
        const barHeightDiff = barHeight - liveBarHeight;

        // If it's currently selected to show a display of crowd level
        // But if the "live record" hour cannot be selected, because there is already another bar showing that
        const isSelected = currentHour != x && displayData?.hour == x;

        return (
          <g key={x}>
            <rect
              rx={4}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              className={clsx(
                `fill-current ${BAR_CHART_COLORS.DEFAULT} stroke-2`,
                {
                  [getBarStrokeFromPercent(y)]: isSelected,
                }
              )}
              onClick={() =>
                setDisplayData({
                  day: today.day,
                  hour: x,
                  percent: y,
                  isLive: false,
                })
              }
            />

            {/* If the last record is this hour, overlay it and display the current crowded level color */}
            {showLiveHour && isNow && (
              <rect
                rx={4}
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

            {showTime && (
              <text
                className="text-sm font-medium text-gray-400 fill-current"
                // @ts-ignore
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
