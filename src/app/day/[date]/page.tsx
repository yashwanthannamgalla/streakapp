import { DailyDashboard } from "@/components/dashboard/DailyDashboard";

type DayPageProps = {
  params: Promise<{
    date: string;
  }>;
};

export default async function DayPage({ params }: DayPageProps) {
  const { date } = await params;

  return <DailyDashboard date={date} />;
}
