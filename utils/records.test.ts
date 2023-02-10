import { record } from "@prisma/client";
import { expect, test } from "vitest";
import {
  getAverageCount,
  getAveragePercent,
  groupRecordsByDate,
} from "./records";

test("group", () => {
  const recordsA: record[] = [
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:00"),
      section_id: 1,
    },
    {
      id: 1,
      count: 12,
      percent: 12,
      time: new Date("2023-01-01 10:10"),
      section_id: 1,
    },
  ];
  const groups = groupRecordsByDate(recordsA);
  expect(groups).toStrictEqual([
    { dateString: "2023-01-01", records: recordsA },
  ]);

  const recordsB: record[] = [
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:00"),
      section_id: 1,
    },
    {
      id: 1,
      count: 12,
      percent: 12,
      time: new Date("2023-01-08 10:10"),
      section_id: 1,
    },
  ];
  const groupsB = groupRecordsByDate(recordsB);
  expect(groupsB).toStrictEqual([
    { dateString: "2023-01-01", records: [recordsB[0]] },
    { dateString: "2023-01-08", records: [recordsB[1]] },
  ]);
});

test("basic average", () => {
  const records: record[] = [
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:00"),
      section_id: 1,
    },
    {
      id: 1,
      count: 12,
      percent: 12,
      time: new Date("2023-01-08 10:00"),
      section_id: 1,
    },
  ];

  const averageCount = getAverageCount({ records, day: 0, hour: 10 });
  const averagePercent = getAveragePercent({ records, day: 0, hour: 10 });

  expect(averageCount).toBe(11);
  expect(averagePercent).toBe(11);
});

test("same day average", () => {
  const records: record[] = [
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:00"),
      section_id: 1,
    },
    {
      id: 1,
      count: 16,
      percent: 16,
      time: new Date("2023-01-01 10:59"),
      section_id: 1,
    },
  ];

  const averageCount = getAverageCount({ records, day: 0, hour: 10 });
  const averagePercent = getAveragePercent({ records, day: 0, hour: 10 });

  expect(averageCount).toBe(13);
  expect(averagePercent).toBe(13);
});

test("multiple days with multiple times", () => {
  const records: record[] = [
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:00"),
      section_id: 1,
    },
    {
      id: 1,
      count: 10,
      percent: 10,
      time: new Date("2023-01-01 10:30"),
      section_id: 1,
    },
    {
      id: 1,
      count: 12,
      percent: 12,
      time: new Date("2023-01-08 10:10"),
      section_id: 1,
    },
  ];
  const expectedAverage = ((10 + 10) / 2 + 12) / 2;
  const actualAverage = getAveragePercent({ records, day: 0, hour: 10 });

  expect(actualAverage).toBe(expectedAverage);
});
