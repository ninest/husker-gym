import { DayHour } from "@/types";
import { record } from "@prisma/client";
import { addHours, format } from "date-fns";

interface GetRecordsParams extends DayHour {
  records: record[];
}

// day is 0-indexed
export const getFilteredRecords = ({
  records,
  day,
  hour,
}: GetRecordsParams) => {
  // Take into account for timezones
  const offsetHours = new Date().getTimezoneOffset() / 60;
  const hourTZ = hour - offsetHours;
  // const hourTZ = hour;
  const filteredRecords = records.filter(
    (record) =>
      record.time.getDay() === day &&
      record.time.getHours() >= hourTZ &&
      record.time.getHours() < hourTZ + 1
  );

  // Add offsetHours to each record
  const offsetRecords = filteredRecords.map((record) => ({
    ...record,
    time: addHours(record.time, offsetHours),
  }));
  return offsetRecords;
};

export const getAverageCount = ({ records, day, hour }: GetRecordsParams) => {
  const filteredRecords = getFilteredRecords({ records, day, hour });
  const groups = groupRecordsByDate(filteredRecords);
  const means = groups.map((group) => {
    const { records } = group;
    const sum = records.reduce((acc, rec) => acc + rec.count, 0);
    return sum / records.length;
  });

  // Return mean of all means
  const sum = means.reduce((acc, curr) => acc + curr, 0);
  return sum / means.length;
};

export const getAveragePercent = ({ records, day, hour }: GetRecordsParams) => {
  const filteredRecords = getFilteredRecords({ records, day, hour });
  const groups = groupRecordsByDate(filteredRecords);
  const means = groups.map((group) => {
    const { records } = group;
    const sum = records.reduce((acc, rec) => acc + rec.percent, 0);
    return sum / records.length;
  });

  // Return mean of all means
  const sum = means.reduce((acc, curr) => acc + curr, 0);
  return sum / means.length;
};

interface Group {
  dateString: string;
  records: record[];
}

export const groupRecordsByDate = (records: record[]) => {
  const groups: Group[] = [];

  records.forEach((record) => {
    const dateString = format(record.time, "yyyy-MM-dd");
    const existingGroup = groups.find(
      (group) => group.dateString === dateString
    );
    if (existingGroup) {
      existingGroup.records.push(record);
    } else {
      groups.push({ dateString, records: [record] });
    }
  });

  return groups;
};
