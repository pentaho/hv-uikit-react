// The Pentaho server's APIs, resolved through the App Shell import map ($server is the server's base path, e.g.
// /pentaho/), so no view hard-codes it. In `npm run dev` they answer from samples.json.

/** The URL of a Pentaho server API: serverUrl("api/scheduler/getJobs"); /pentaho/… in tests, which have no App Shell. */
export function serverUrl(path: string) {
  if (import.meta.env.MODE === "test")
    return new URL(`/pentaho/${path}`, globalThis.location?.href).href;
  return import.meta.resolve(`$server/${path}`);
}

async function json<T>(response: Response, url: string): Promise<T> {
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const body = await response.text();
  return (body ? JSON.parse(body) : undefined) as T;
}

/** GET JSON with the session's cookie; throws with the status on an error response. */
export async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });
  return json<T>(response, url);
}

/** GET a plain-text answer (some Pentaho APIs, e.g. api/repo/files/canAdminister, send text, not JSON). */
export async function getText(url: string): Promise<string> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { Accept: "text/plain" },
  });
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

/** The server's CSRF header for a request to `url`, or none when the server doesn't protect it. */
async function csrfHeader(url: string): Promise<Record<string, string>> {
  const response = await fetch(
    serverUrl(`api/csrf/token?url=${encodeURIComponent(url)}`),
    {
      credentials: "include",
    },
  );
  const header = response.headers.get("X-CSRF-HEADER");
  const token = response.headers.get("X-CSRF-TOKEN");
  return header && token ? { [header]: token } : {};
}

type Write = "POST" | "PUT" | "DELETE";

async function send<T>(
  method: Write,
  url: string,
  body: string | undefined,
  type: string,
): Promise<T> {
  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": type,
      ...(await csrfHeader(url)),
    },
    body,
  });
  return json<T>(response, url);
}

/** A write with a JSON body, the session's cookie and the CSRF token; the response's JSON, if any (`sendJson<undefined>` for none). */
export const sendJson = <T>(method: Write, url: string, body?: unknown) =>
  send<T>(
    method,
    url,
    body === undefined ? undefined : JSON.stringify(body),
    "application/json",
  );

/** A write with a plain-text body (some Pentaho APIs take one, e.g. ids comma-separated); the response's JSON, if any. */
export const sendText = <T>(method: Write, url: string, body: string) =>
  send<T>(method, url, body, "text/plain");
