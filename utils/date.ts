import { formatDistance, subMinutes } from "date-fns";

export const bostonTime = (): Date => {
  const offset = new Date().getTimezoneOffset();
  return subMinutes(new Date(), offset);
};

// Create a "Last updated 30 minutes back" / "Last updated at 19:30"
export const lastUpdated = (date: Date): string => {
  const now = bostonTime();
  // TODO: // If last updated less than 2 hours back, only then show relative time
  const relativeTimeBack = formatDistance(now, date);
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
