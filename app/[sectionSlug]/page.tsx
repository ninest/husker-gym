import { getUtcToEstDayHour, serializeListWithDate } from "@/date/utils";
import { getRecentRecords, getSectionBySlug } from "@/db/functions";
import { DayBarChart } from "./components/DayBarChart";
import { WeekHeatMap } from "./components/WeekHeatMap";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/Tabs";
import { BackButton } from "@/components/BackButton";
import { DataDisplay } from "./components/DataDisplay";

export const revalidate = 0; // no cache

interface SectionPageProps {
  params: { sectionSlug: string };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const section = await getSectionBySlug(params.sectionSlug);
  const records = await getRecentRecords({
    sectionId: section?.id!,
    // four weeks
    daysBack: 4 * 7,
  });

  // TODO: section invalid, show error

  // This is always run on the server
  const today = getUtcToEstDayHour(new Date());
  const serializedRecords = serializeListWithDate(records, "time");

  return (
    <main className="max-w-[60ch] mx-auto p-5">
      <BackButton text="Gyms" />
      <h1 className="mt-4 font-bold text-2xl mb-2">{section?.name}</h1>
      <div className="mb-4">{section?.description}</div>

      <Tabs defaultValue="day">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
        </TabsList>

        <TabsContent value="day">
          <DataDisplay />
          <DayBarChart
            serializedRecords={serializedRecords}
            today={today}
            className="relative w-full h-64"
          />
        </TabsContent>
        <TabsContent value="week">
          <WeekHeatMap
            section={section!}
            serializedRecords={serializedRecords}
            today={today}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
