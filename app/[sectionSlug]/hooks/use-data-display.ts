import { DataPoint, DayHour } from "@/types";
import { atom, useAtom } from "jotai";

interface DisplayDataPoint extends DayHour, DataPoint {
  isLive: boolean;
}

const dataDisplayAtom = atom<DisplayDataPoint | null>(null);

export const useDataDisplay = () => {
  const [displayData, setDisplayData] = useAtom(dataDisplayAtom);

  return { displayData, setDisplayData };
};
