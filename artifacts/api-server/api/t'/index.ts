/**
 * Vercel Functions entrypoint.
 *
 * Vercel's Node.js runtime accepts any (req, res) => void handler, and an
 * Express app satisfies that signature directly — so we export it as-is
 * instead of calling app.listen(). All routing/middleware (Clerk, the
 * /api/__clerk proxy, cors, pino-http, etc.) stays exactly as defined in
 * src/app.ts; nothing is duplicated here.
 *
 * `vercel.json` rewrites every request to this single function, so the
 * Express app still sees the original path (e.g. /api/skills) and its own
 * internal `app.use("/api", router)` mounting keeps working unchanged.
 *
 * This file is NOT used for local dev or for non-Vercel deployments
 * (Railway/Render/VPS/etc.) — those keep using src/index.ts, which calls
 * app.listen() on $PORT as before.
 */
import app from "../src/app";

export default app;
