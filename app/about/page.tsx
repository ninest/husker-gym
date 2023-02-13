import { BackButton } from "@/components/BackButton";
import { Title } from "@/components/Title";
import { serializeListWithDate } from "@/date/utils";
import { getTextBgColor } from "@/style/colors";
import { addHours, subHours } from "date-fns/esm";
import Link from "next/link";
import { CompactDayBarChart } from "../components/CompactDayBarChart";
import { DayBarChart } from "../[sectionSlug]/components/DayBarChart";

export default function AboutPage() {
  const exampleToday = new Date("2023-01-01 16:00");
  const exampleRecords = [
    {
      percent: 67,
      time: exampleToday,
    },
    {
      percent: 47,
      time: subHours(exampleToday, 10),
    },
    {
      percent: 79,
      time: subHours(exampleToday, 9),
    },
    {
      percent: 104,
      time: subHours(exampleToday, 8),
    },
    {
      percent: 68,
      time: subHours(exampleToday, 7),
    },
    {
      percent: 50,
      time: subHours(exampleToday, 6),
    },
    {
      percent: 38,
      time: subHours(exampleToday, 5),
    },
    {
      percent: 34,
      time: subHours(exampleToday, 4),
    },
    {
      percent: 30,
      time: subHours(exampleToday, 3),
    },
    {
      percent: 25,
      time: subHours(exampleToday, 2),
    },
    {
      percent: 45,
      time: subHours(exampleToday, 1),
    },
    {
      percent: 80,
      time: addHours(exampleToday, 1),
    },
    {
      percent: 45,
      time: addHours(exampleToday, 2),
    },
    {
      percent: 55,
      time: addHours(exampleToday, 3),
    },
    {
      percent: 79,
      time: addHours(exampleToday, 4),
    },
    {
      percent: 90,
      time: addHours(exampleToday, 5),
    },
    {
      percent: 34,
      time: addHours(exampleToday, 6),
    },
    {
      percent: 12,
      time: addHours(exampleToday, 7),
    },
  ].map((item) => ({
    id: 1,
    count: 1,
    section_id: 1,
    ...item,
  }));
  const exampleRecordsCrowded = [
    {
      percent: 40,
      time: exampleToday,
    },
    {
      percent: 105,
      time: subHours(exampleToday, 2),
    },
    {
      percent: 85,
      time: subHours(exampleToday, 1),
    },
    {
      percent: 55,
      time: addHours(exampleToday, 1),
    },
    {
      percent: 55,
      time: addHours(exampleToday, 2),
    },
  ].map((item) => ({
    id: 1,
    count: 1,
    section_id: 1,
    ...item,
  }));
  return (
    <main className="max-w-[60ch] mx-auto p-5 space-y-3">
      <BackButton text="Back" />
      <Title className="mt-4" level={1}>
        About
      </Title>
      <p>
        Husker Gym (name not final) is a website that aims to show you the best
        times to go to the gym. It does this by showing you a quick view, daily
        view, and weekly view on the crowd levels in the gym.
      </p>
      <Title level={2}>Quick View</Title>
      <p>
        On the{" "}
        <Link href="/" className="underline">
          main page
        </Link>{" "}
        of the website, you will see a list of gyms along with a live
        description and a bar chart. The bar chart aims to show you how full the
        gym is now, how full it was in the past 2 hours, and an estimate of how
        full it <i>might</i> be in the next two hours.
      </p>

      <p>For example:</p>

      <CompactDayBarChart
        today={{
          day: exampleToday.getUTCDay(),
          hour: exampleToday.getUTCHours(),
        }}
        serializedRecords={serializeListWithDate(exampleRecords, "time")}
        className="w-1/3 h-[5.5rem]"
      />

      <p>
        Assuming it is currently 4 PM, the gym is crowded. At 5 PM, it is
        expected to get more crowded, and at 6 PM, it's expected to get less
        crowded.
      </p>

      <p>The bars will be color coded based on how crowded the gym is:</p>

      <ul className="list-disc ml-5">
        <li>
          <span className={getTextBgColor(39)}>Blue</span> means the gym is not
          very busy (the gym is at 0 to 40% full)
        </li>
        <li>
          <span className={getTextBgColor(59)}>Orange</span> means the gym is
          fairly busy (40 to 60% full)
        </li>
        <li>
          <span className={getTextBgColor(79)}>Red</span> means the gym is
          crowded (60 to 80% full)
        </li>
        <li>
          <span className={getTextBgColor(100)}>Pink</span> means the gym is
          very crowded (more than 80% full)
        </li>
      </ul>

      <p>
        On the chart above, you may notice the dotted line going through. These
        lines represent the 50% and 100% mark of the gym's capacity
      </p>

      <p>
        For example, this chart below shows that the gym was at more than 100%
        of its capacity at 2 PM, but is now at below 50% of its capacity.
      </p>

      <CompactDayBarChart
        today={{
          day: exampleToday.getUTCDay(),
          hour: exampleToday.getUTCHours(),
        }}
        serializedRecords={serializeListWithDate(exampleRecordsCrowded, "time")}
        className="w-1/3 h-[5.5rem]"
      />

      <Title level={2}>Day view</Title>
      <p>
        The day view is quite similar. It's the same as the quick view, but it
        shows data for the entire day.
      </p>

      <DayBarChart
        today={{
          day: exampleToday.getUTCDay(),
          hour: exampleToday.getUTCHours(),
        }}
        serializedRecords={serializeListWithDate(exampleRecords, "time")}
        className="w-full h-64"
      />

      <p>
        This chart shows that on the current day, the gym was very crowded
        between 7 to 8 AM, but not very crowded between 11 to 2 PM.
      </p>

      <p>
        The current hour is the one in color. In this case, assume it is 4 PM.
      </p>

      <Title level={3}>Week view</Title>
      <p>
        The week view is a heatmap of an estimate of how crowded the gym is at
        on a particular day (Monday to Saturday) at a particular time (5 AM to
        11 PM).
      </p>

      <p>
        See the graph for{" "}
        <Link href="/marino-gymnasium" className="underline">
          the Marino Gymnasium
        </Link>
        , for example, by clicking the link, and pressing "Week".
      </p>
    </main>
  );
}
