// `npm run dev` without a Pentaho server: the views' server calls answer from samples.json, keyed "METHOD /path"
// ({param} segments match any value). null answers with no body, and {"$status": 503, "body": …} with that status (an
// error state); a call with no sample is a 404 that names it, so a missing sample is never mistaken for an empty list. The server's CSRF token has no sample:
// in development, writes go without one.
// Dates stay as old as they were written: "$written" is the day the samples were written, and every date in them
// moves by the days since, so "deleted 3 days ago" stays 3 days ago. A state with other data (an empty list, an
// error) is a file of its own that overrides only what changes: a page opened with ?samples=empty (or the dev server
// started with SAMPLES=empty) reads samples.empty.json over them.
import fs from "node:fs";
import type { Connect, Plugin } from "vite";

import { BASE } from "./plugin.ts";

/** A samples.json key: "METHOD /path". */
const KEY = /^(GET|POST|PUT|DELETE) (\/\S*)$/;
/** The path api.ts asks the server's CSRF token at. */
const CSRF_PATH = "/api/csrf/token";
/** The samples' key for the day they were written (YYYY-MM-DD). */
const WRITTEN = "$written";
/** A sample that answers with an HTTP status: {"$status": 503, "body": …}. */
const STATUS = "$status";
const DAY_MS = 24 * 60 * 60 * 1000;
/** A date as servers write them: ISO (2026-11-14, 2026-11-14T09:30:00Z), or epoch milliseconds (2001 to 2033). */
const ISO =
  /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const EPOCH_MS = /^1\d{12}$/;

type Samples = Record<string, unknown>;

/** Every date in a value moved by `days`, each kept in its own format: only the date part changes, its time and offset stay. */
function shift(value: unknown, days: number): unknown {
  if (Array.isArray(value)) return value.map((each) => shift(each, days));
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, each]) => [key, shift(each, days)]),
    );
  const by = days * DAY_MS;
  if (typeof value === "number")
    return EPOCH_MS.test(String(value)) ? value + by : value;
  if (typeof value !== "string") return value;
  if (EPOCH_MS.test(value)) return String(Number(value) + by);
  if (!ISO.test(value)) return value;

  const day = new Date(Date.parse(`${value.slice(0, 10)}T00:00:00Z`) + by);
  return `${day.toISOString().slice(0, 10)}${value.slice(10)}`;
}

/** Calendar days from `written` (YYYY-MM-DD) to today, where the dev server runs. */
function daysSince(written: string) {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round(
    (today - Date.parse(`${written.slice(0, 10)}T00:00:00Z`)) / DAY_MS,
  );
}

/** The samples, the state's file over them, with their dates moved to today; read again on each call. */
export function read(file: string, state?: string): Samples {
  const base: Samples = JSON.parse(fs.readFileSync(file, "utf8"));
  const over: Samples = state
    ? JSON.parse(fs.readFileSync(stateFile(file, state), "utf8"))
    : {};
  const { [WRITTEN]: written, ...all } = { ...base, ...over };
  return typeof written === "string"
    ? (shift(all, daysSince(written)) as Samples)
    : all;
}

const stateFile = (file: string, state: string) =>
  file.replace(/\.json$/, `.${state}.json`);

/** Whether a "METHOD /path" key answers a call; a key in another shape is an error that names it. */
function answers(key: string, method: string, path: string): boolean {
  const match = KEY.exec(key);
  if (!match) throw new Error(`samples: "${key}" is not "METHOD /path"`);

  const escaped = match[2]
    .replace(/[.*+?^$()|[\]\\]/g, "\\$&")
    .replace(/\{\w+\}/g, "[^/]+");
  return match[1] === method && new RegExp(`^${escaped}$`).test(path);
}

const isStatus = (
  value: unknown,
): value is { [STATUS]: number; body?: unknown } =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as Record<string, unknown>)[STATUS] === "number";

/** The answer to a call from the samples: its status, and its body as text (none for 204). */
export function answer(
  all: Samples,
  method: string,
  path: string,
  file = "samples.json",
): { status: number; body?: string } {
  const key = Object.keys(all).find((candidate) =>
    answers(candidate, method, path),
  );
  if (key === undefined)
    return { status: 404, body: `No sample for ${method} ${path} in ${file}` };
  const value = all[key];
  if (value === null) return { status: 204 };
  if (isStatus(value)) {
    const { [STATUS]: status, body } = value;
    return {
      status,
      body: body === undefined ? undefined : JSON.stringify(body),
    };
  }
  return { status: 200, body: JSON.stringify(value) };
}

/** The middleware that answers the server's calls from `file`, and the state's file over it. */
function answerFrom(file: string, state?: string): Connect.NextHandleFunction {
  return (request, response) => {
    const method = request.method ?? "GET";
    const path = (request.url ?? "/").split("?")[0];
    if (path === CSRF_PATH) {
      response.writeHead(204).end();
      return;
    }

    // the state the page was opened with (?samples=empty) wins over the server's
    const referer = request.headers.referer;
    let asked: string | null = null;
    try {
      asked = referer ? new URL(referer).searchParams.get("samples") : null;
    } catch {
      // not a URL: the server's state
    }
    const current = asked ?? state;
    if (current && !fs.existsSync(stateFile(file, current))) {
      response
        .writeHead(404, { "Content-Type": "text/plain" })
        .end(`No ${stateFile(file, current)} for samples=${current}`);
      return;
    }

    const { status, body } = answer(read(file, current), method, path, file);
    response
      .writeHead(status, {
        "Content-Type": status === 404 ? "text/plain" : "application/json",
      })
      .end(body);
  };
}

/** The samples, for `npm run dev` and `npm run preview`. */
export function samples(file: string, state = process.env.SAMPLES): Plugin {
  if (state && !fs.existsSync(stateFile(file, state)))
    throw new Error(`SAMPLES=${state}: there is no ${stateFile(file, state)}`);

  return {
    name: "pentaho-samples",
    configureServer(server) {
      server.middlewares.use(BASE, answerFrom(file, state));
    },
    configurePreviewServer(server) {
      server.middlewares.use(BASE, answerFrom(file, state));
    },
  };
}
