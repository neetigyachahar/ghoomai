import { WidgetError } from "@repo/ui/widget-error";

export interface WidgetErrorWidgetProps {
  widgetKey?: string;
  message: string;
  details?: string;
}

export function WidgetErrorWidget({
  widgetKey,
  message,
  details,
}: WidgetErrorWidgetProps) {
  return (
    <WidgetError widgetKey={widgetKey} message={message} details={details} />
  );
}
