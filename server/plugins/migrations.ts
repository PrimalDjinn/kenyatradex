import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@nuxthub/db";
import { consola } from "consola";
import { isProduction, isNode, isBun, isDeno, env } from "std-env";

interface MigrationJournal {
  version: string;
  dialect: string;
  entries: {
    idx: number;
    version: string;
    when: number;
    tag: string;
    breakpoints: boolean;
  }[];
}

export default defineNitroPlugin(async () => {
  // Only apply programmatically in production envs
  if (!isProduction) return;

  // Skip during Nitro prerendering
  if (import.meta.prerender || process.env.NITRO_PRERENDER === "true") {
    consola.info("[Migrations] Prerendering detected. Skipping database migrations.");
    return;
  }

  // Only run migrations in a Node-like environment (Node, Bun, or Deno)
  const isNodeLike = isNode || isBun || isDeno;
  if (!isNodeLike) {
    consola.info("[Migrations] Non-Node-like environment detected. Skipping migrations.");
    return;
  }

  // Check if we have a valid DATABASE_URL in our std-env variables
  if (!env.DATABASE_URL) {
    consola.warn("[Migrations] DATABASE_URL is not set in std-env. Skipping migrations check.");
    return;
  }

  consola.info("[Migrations] Starting production database migrations check from Nitro server assets...");

  try {
    const storage = useStorage("assets:migrations");
    const journal = (await storage.getItem("meta/_journal.json")) as MigrationJournal | null;

    if (!journal) {
      consola.warn("[Migrations] No migration journal found in Nitro server assets. Skipping migrations.");
      return;
    }

    // Create a temporary directory to host the physical files for Drizzle Migrator
    const tempDir = mkdtempSync(join(tmpdir(), "nuxt-migrations-"));
    consola.info(`[Migrations] Staging migration files in temporary directory: ${tempDir}`);

    // 1. Write the journal file
    const journalPath = join(tempDir, "meta/_journal.json");
    mkdirSync(dirname(journalPath), { recursive: true });
    writeFileSync(journalPath, JSON.stringify(journal, null, 2), "utf8");

    // 2. Write each migration SQL and snapshot file listed in the journal
    for (const entry of journal.entries || []) {
      const sqlKey = `${entry.tag}.sql`;
      const sqlContent = await storage.getItem(sqlKey);
      if (sqlContent) {
        const sqlPath = join(tempDir, sqlKey);
        writeFileSync(sqlPath, sqlContent as string, "utf8");
      }

      const snapshotKey = `meta/${String(entry.idx).padStart(4, "0")}_snapshot.json`;
      const snapshotContent = await storage.getItem(snapshotKey);
      if (snapshotContent) {
        const snapshotPath = join(tempDir, snapshotKey);
        mkdirSync(dirname(snapshotPath), { recursive: true });
        const writeSnapshot =
          typeof snapshotContent === "string" ? snapshotContent : JSON.stringify(snapshotContent, null, 2);
        writeFileSync(snapshotPath, writeSnapshot, "utf8");
      }
    }

    consola.info("[Migrations] Applying migrations...");
    await migrate(db, { migrationsFolder: tempDir });
    consola.success("[Migrations] Database migrations applied successfully.");
  } catch (err) {
    consola.error("[Migrations] Failed to apply database migrations:", err);
    process.exit(1);
  }
});
