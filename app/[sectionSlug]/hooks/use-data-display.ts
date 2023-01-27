import { DataPoint } from "@/types";
import { atom, useAtom } from "jotai";

const dataDisplayAtom = atom<DataPoint | null>(null);

export const useDataDisplay = () => {
  const [displayData, setDisplayData] = useAtom(dataDisplayAtom);

  return { displayData, setDisplayData };
};
