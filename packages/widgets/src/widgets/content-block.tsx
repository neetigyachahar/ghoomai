import { ContentBlock } from "@repo/ui/content-block";

export interface ContentBlockWidgetProps {
  content: string;
  heading?: string;
}

export function ContentBlockWidget({ heading, content }: ContentBlockWidgetProps) {
  return <ContentBlock heading={heading} content={content} />;
}
