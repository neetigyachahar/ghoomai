export function getAiConfigEndpoint(layoutEndpoint: string): string {
  return layoutEndpoint.replace(/\/layout\/?$/, "/config");
}
