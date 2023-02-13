/* DISPLAY FUNCTIONS */

import { formatDistance } from "date-fns";

// Create a "Last updated 30 minutes back" / "Last updated at 19:30"
export const lastUpdated = (date: Date): string => {
  // TODO: If last updated less than 2 hours back, only then show relative time
  const relativeTimeBack = formatDistance(new Date(), date);
  return `Updated ${relativeTimeBack} back`;
};

// Need better name
// 17 -> 5 PM
export const twentyFourHourToAMPMHour = (hour: number): string => {
  if (hour === 12) return `12 PM`
  if (hour > 12) {
    return `${hour - 12} PM`;
  } else {
    return `${hour} AM`;
  }
};

// Need better name
// 17 -> 5p
export const twentyFourHourToShortAMPMHour = (hour: number): string => {
  if (hour === 12) return `12p`
  if (hour > 12) {
    return `${hour - 12}p`;
  } else {
    return `${hour}a`;
  }
};


/* UTILS */
export const DAYS = [
  { name: "Sunday", shortName: "Sun", singleChar: "S" },
  { name: "Monday", shortName: "Mon", singleChar: "M" },
  { name: "Tuesday", shortName: "Tue", singleChar: "T" },
  { name: "Wednesday", shortName: "Wed", singleChar: "W" },
  { name: "Thursday", shortName: "Thu", singleChar: "R" },
  { name: "Friday", shortName: "Fri", singleChar: "F" },
  { name: "Saturday", shortName: "Sat", singleChar: "S" },
];

export const HOURS = [
  /* 0, 1, 2, 3, 4 */ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23,
];
