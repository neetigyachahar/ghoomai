import { TripHeader, type TripStat } from "@repo/ui/trip-header";

export interface TripHeaderWidgetProps {
  title: string;
  subtitle?: string;
  stats?: TripStat[];
}

export function TripHeaderWidget({ title, subtitle, stats }: TripHeaderWidgetProps) {
  return <TripHeader title={title} subtitle={subtitle} stats={stats} />;
}
