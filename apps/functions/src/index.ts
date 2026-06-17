import cors from "cors";
import express from "express";
import { onRequest } from "firebase-functions/v2/https";

import {
  handleApiRequest,
  nodeRequestToWeb,
  webResponseToNode,
} from "@repo/api";

function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "1mb" }));

  app.all("*", async (req, res) => {
    try {
      const protocol = req.get("x-forwarded-proto") ?? "https";
      const host = req.get("host") ?? "localhost";
      const request = nodeRequestToWeb(req, `${protocol}://${host}`);
      const response = await handleApiRequest(request);

      await webResponseToNode(res, response);
    } catch (error) {
      console.error("API request failed", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return app;
}

const app = createApp();

export const ghoomaiApi = onRequest(
  {
    region: "us-central1",
    memory: "1GiB",
    timeoutSeconds: 300,
    cors: true,
    invoker: "public",
  },
  app,
);
