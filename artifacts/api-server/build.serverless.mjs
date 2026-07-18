/**
 * Serverless build — bundles src/app.ts into dist/app.mjs
 * Used by Vercel: api/index.js imports this bundle directly,
 * bypassing all TypeScript compilation issues.
 *
 * Does NOT include the pino-pretty transport (not needed in production).
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const artifactDir = path.dirname(fileURLToPath(import.meta.url));

async function buildServerless() {
  // Remove only the serverless output file, leave rest of dist intact
  await rm(path.resolve(artifactDir, "dist/app.mjs"), { force: true });
  await rm(path.resolve(artifactDir, "dist/app.mjs.map"), { force: true });

  await esbuild({
    entryPoints: [path.resolve(artifactDir, "src/app.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: path.resolve(artifactDir, "dist/app.mjs"),
    logLevel: "info",
    external: [
      "*.node",
      // pino internals that load native bindings
      "pino-pretty",
      "thread-stream",
      // other native / unbundleable packages
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "xxhash-addon",
      "bufferutil",
      "utf-8-validate",
      "pg-native",
      "oracledb",
      "mongodb-client-encryption",
    ],
    sourcemap: "linked",
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });
}

buildServerless().catch((err) => {
  console.error(err);
  process.exit(1);
});
