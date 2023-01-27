"use client";

import { twentyFourHourToAMPMHour } from "@/date/display";
import { crowdLevelDescription } from "@/string";
import { getTextBgColor } from "@/style/colors";
import clsx from "clsx";
import { useDataDisplay } from "../hooks/use-data-display";

export const DataDisplay = () => {
  const { displayData } = useDataDisplay();

  if (!displayData) return <></>;
  return (
    <div>
      <span className={clsx("font-bold", getTextBgColor(displayData.percent))}>
        {twentyFourHourToAMPMHour(displayData.hour)}
      </span>
      : {crowdLevelDescription(displayData.percent)}
    </div>
  );
};
