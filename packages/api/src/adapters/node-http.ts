import type { IncomingMessage, ServerResponse } from "node:http";

type NodeLikeRequest = IncomingMessage & {
  method?: string;
  body?: unknown;
};

type NodeLikeResponse = ServerResponse;

export function nodeRequestToWeb(
  req: NodeLikeRequest,
  baseUrl: string,
): Request {
  const url = new URL(req.url ?? "/", baseUrl);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) {
      continue;
    }

    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }

  const method = req.method?.toUpperCase() ?? "GET";
  const hasBody = method !== "GET" && method !== "HEAD";

  return new Request(url, {
    method,
    headers,
    body:
      hasBody && req.body !== undefined
        ? typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body)
        : undefined,
  });
}

export async function webResponseToNode(
  res: NodeLikeResponse,
  response: Response,
): Promise<void> {
  res.statusCode = response.status;

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  const reader = response.body.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      res.write(Buffer.from(value));
    }
  } finally {
    res.end();
  }
}
