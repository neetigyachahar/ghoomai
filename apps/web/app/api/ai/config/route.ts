import { isServerApiKeyConfigured } from "@repo/api";

export async function GET() {
  return Response.json({
    serverKeyConfigured: isServerApiKeyConfigured(process.env.ANTHROPIC_API_KEY),
  });
}
