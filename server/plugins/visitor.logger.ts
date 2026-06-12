import { consola } from "consola";
import { ulid } from "ulid";
import { toNumber } from "@chiballc/utils";

declare module "h3" {
  interface H3EventContext {
    __meta?: {
      start?: number;
      id?: string;
    };
  }
}

// ANSI color helpers
const c = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
};

function methodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: c.green,
    POST: c.blue,
    PUT: c.yellow,
    PATCH: c.magenta,
    DELETE: c.red,
    HEAD: c.cyan,
    OPTIONS: c.gray,
  };
  return colors[method] ?? c.white;
}

function statusColor(status: number): string {
  if (status < 300) return c.green;
  if (status < 400) return c.cyan;
  if (status < 500) return c.yellow;
  return c.red;
}

function durationColor(ms: number): string {
  if (ms <= 100) return c.green;
  if (ms <= 300) return c.yellow;
  if (ms <= 1000) return c.red;
  return c.red + c.bold;
}

function formatMethod(method: string): string {
  return `${methodColor(method)}${method.padEnd(7)}${c.reset}`;
}

function formatStatus(status: number): string {
  return `${statusColor(status)}${status}${c.reset}`;
}

function formatDuration(ms: number): string {
  const label = ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms}ms`;
  return `${durationColor(ms)}${label}${c.reset}`;
}

function formatPath(path: string): string {
  const [pathname, query] = path.split("?");
  return query ? `${c.white}${pathname}${c.reset}${c.dim}?${query}${c.reset}` : `${c.white}${pathname}${c.reset}`;
}

export default defineNitroPlugin((app) => {
  const logger = consola.withTag("http");

  app.hooks.hook("request", (event) => {
    event.context.__meta = {
      id: ulid(),
      start: performance.now(),
    };

    // Incoming request line — helpful in dev, can be gated behind a verbose flag
    const reqId = `${c.dim}[${event.context.__meta.id}]${c.reset}`;
    logger.debug(`${reqId} → ${formatMethod(event.method)} ${formatPath(event.path)}`);
  });

  app.hooks.hook("afterResponse", (event) => {
    const meta = event.context.__meta;
    if (!meta?.start) return;

    const duration = Math.round(performance.now() - meta.start);
    const status = event.node.res.statusCode;
    const reqId = meta.id ? `${c.dim}[${meta.id}]${c.reset} ` : "";

    const line = [
      reqId,
      `← ${formatMethod(event.method)}`,
      formatPath(event.path),
      formatStatus(status),
      formatDuration(toNumber(duration)),
    ].join(" ");

    if (status >= 500) {
      const msg = event.node.res.statusMessage;
      logger.error(`${line}${msg ? ` ${c.dim}${msg}${c.reset}` : ""}`);
    } else if (status >= 400) {
      logger.warn(line);
    } else if (toNumber(duration) > 300) {
      logger.warn(`${line} ${c.dim}(slow)${c.reset}`);
    } else {
      logger.info(line);
    }
  });
});
