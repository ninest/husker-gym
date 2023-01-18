import { DayHour } from "@/types";
import { formatDistance, subMinutes } from "date-fns";

export const bostonTime = (): Date => {
  const offset = new Date().getTimezoneOffset();
  return subMinutes(new Date(), offset);
};

export const utcToEst = (date: Date): Date => {
  return subMinutes(date, 300);
};

export const getUtcToEstDayHour = (date: Date): DayHour => {
  // utc to est conversion
  // TODO: use timezone instead of offset to account for DST
  const est = subMinutes(date, 300);
  return {
    day: est.getDay(),
    hour: est.getHours(),
  };
};

// Create a "Last updated 30 minutes back" / "Last updated at 19:30"
export const lastUpdated = (date: Date): string => {
  // TODO: If last updated less than 2 hours back, only then show relative time
  const relativeTimeBack = formatDistance(new Date(), date);
  return `Last updated ${relativeTimeBack} back`;
};

export const serializeListWithDate = <T>(list: T[], dateKey: string): T[] => {
  return list.map((item: any) => ({
    ...item,
    [dateKey]: (item[dateKey] as Date).toString(),
  }));
};

export const parseListWithDate = <T>(list: T[], dateKey: string): T[] => {
  return list.map((item: any) => ({
    ...item,
    [dateKey]: new Date(item[dateKey]),
  }));
};
