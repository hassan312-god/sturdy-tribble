/**
 * Vercel serverless entry point — wraps the Express app.
 * Handles all /api/* routes.
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";

let appPromise: Promise<any> | null = null;

function getApp() {
  if (!appPromise) {
    appPromise = import("../artifacts/api-server/src/app").then((m) => m.default);
  }
  return appPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  return app(req, res);
}
