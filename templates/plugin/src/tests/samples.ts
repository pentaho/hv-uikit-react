// Tests on the samples: `answerFromSamples()` answers the views' server calls as `npm run dev` does, from the same
// samples.json (and a state's file over it, `answerFromSamples("empty")`, or samples of the test's own over it), with
// the same matching and dates, and records each call.
import path from "node:path";
import { vi } from "vitest";

import { answer, read } from "../../samples.ts";

type Call = { method: string; path: string; body?: unknown };

const FILE = path.resolve(import.meta.dirname, "../../samples.json");

/** Stubs fetch with the samples (vitest restores it after each test); returns the calls made. */
export function answerFromSamples(over?: string | Record<string, unknown>) {
  const state = typeof over === "string" ? over : undefined;
  const extra = typeof over === "object" ? over : {};
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      const url = new URL(String(input), "http://localhost");
      const callPath = url.pathname.replace(/^\/pentaho/, "");
      const sent =
        typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
      calls.push({
        method,
        path: callPath,
        ...(sent === undefined ? {} : { body: sent }),
      });
      if (callPath === "/api/csrf/token")
        return new Response(null, { status: 204 });
      const { status, body } = answer(
        { ...read(FILE, state), ...extra },
        method,
        callPath,
        FILE,
      );
      return new Response(body ?? null, { status });
    },
  );
  return calls;
}
