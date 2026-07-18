/**
 * Vercel serverless entry point.
 *
 * Imports the pre-built Express app bundle (dist/app.mjs) produced by
 * `pnpm --filter @workspace/api-server run build:serverless`.
 *
 * Using plain JS avoids Vercel's strict TypeScript/nodenext compilation
 * of the monorepo source, which caused duplicate drizzle-orm type conflicts,
 * missing @vercel/node types, and Express 5 strict-mode errors.
 */
import app from "../artifacts/api-server/dist/app.mjs";

export default app;
