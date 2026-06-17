export function normalizeApiBase(apiBase = ""): string {
  return apiBase.replace(/\/$/, "");
}

export function getAiLayoutEndpoint(apiBase = ""): string {
  const base = normalizeApiBase(apiBase);

  return base ? `${base}/api/ai/layout` : "/api/ai/layout";
}

export function getAiConfigEndpoint(apiBase = ""): string {
  const base = normalizeApiBase(apiBase);

  return base ? `${base}/api/ai/config` : "/api/ai/config";
}

export function getTravelResourceEndpoint(
  apiBase: string,
  resourceType: string,
  resourceId: string,
): string {
  const base = normalizeApiBase(apiBase);
  const path = `/api/travel/resource/${resourceType}/${resourceId}`;

  return base ? `${base}${path}` : path;
}
