import { ANTHROPIC_API_KEY_HEADER } from "@repo/types";

export function isServerApiKeyConfigured(
  serverKey: string | undefined,
): boolean {
  return Boolean(serverKey?.trim());
}

export function resolveAnthropicApiKey(
  serverKey: string | undefined,
  clientKey: string | undefined,
): string | null {
  if (serverKey?.trim()) {
    return serverKey.trim();
  }

  if (clientKey?.trim()) {
    return clientKey.trim();
  }

  return null;
}

export function getClientApiKeyFromRequest(request: Request): string | undefined {
  return request.headers.get(ANTHROPIC_API_KEY_HEADER) ?? undefined;
}
