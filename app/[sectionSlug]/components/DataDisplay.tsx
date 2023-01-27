"use client";

import { DAYS, twentyFourHourToAMPMHour } from "@/date/display";
import { crowdLevelDescription } from "@/string";
import { getTextBgColor } from "@/style/colors";
import clsx from "clsx";
import { useDataDisplay } from "../hooks/use-data-display";

export const DataDisplay = () => {
  const { displayData } = useDataDisplay();

  if (!displayData) return <></>;
  return (
    <div>
      <span
        className={clsx(
          "font-bold rounded p-[0.2px]",
          getTextBgColor(displayData.percent)
        )}
      >
        {DAYS[displayData.day].shortName},{" "}
        {twentyFourHourToAMPMHour(displayData.hour)}
      </span>
      : {displayData.isLive ? "Currently" : "Usually"}{" "}
      {crowdLevelDescription(displayData.percent)}
    </div>
  );
};
