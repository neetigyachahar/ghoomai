import { GETTravelResource } from "@repo/api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string; id: string }> },
) {
  const { type, id } = await context.params;
  return GETTravelResource(type, id);
}
