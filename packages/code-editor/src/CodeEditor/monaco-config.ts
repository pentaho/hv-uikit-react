import { loader, type Monaco } from "@monaco-editor/react";

declare global {
  interface Window {
    MonacoEnvironment?: import("monaco-editor").Environment;
  }
}

let monacoInstance: Monaco | null = null;
let initPromise: Promise<Monaco> | null = null;

// Static imports required for Vite's ?worker transform
const WORKER_LOADERS = {
  json: () => import("monaco-editor/esm/vs/language/json/json.worker?worker"),
  css: () => import("monaco-editor/esm/vs/language/css/css.worker?worker"),
  html: () => import("monaco-editor/esm/vs/language/html/html.worker?worker"),
  typescript: () =>
    import("monaco-editor/esm/vs/language/typescript/ts.worker?worker"),
  javascript: () =>
    import("monaco-editor/esm/vs/language/typescript/ts.worker?worker"),
  editor: () => import("monaco-editor/esm/vs/editor/editor.worker?worker"),
} as const;

type WorkerLabel = keyof typeof WORKER_LOADERS;

/**
 * Detects if running in a Vite-bundled environment.
 * Checks for Vite's dev server or the presence of ?worker import support.
 */
const isViteBundler = (): boolean => {
  const url = import.meta?.url ?? "";
  return url.includes("http://") || url.includes("https://");
};

/**
 * Creates a worker with blob URL fallback for CSP/cross-origin restrictions.
 * Only used in Vite mode with bundled workers - maintains offline capability.
 */
const createWorker = (WorkerCtor: new () => Worker): Worker => {
  try {
    return new WorkerCtor();
  } catch {
    // Extract URL from Vite-generated constructor and load via importScripts
    const match = WorkerCtor.toString().match(
      /new URL\("([^"]+)",import\.meta\.url\)/,
    );
    if (!match) throw new Error("Failed to create Monaco worker");

    const baseUrl = new URL(import.meta.url).origin;
    const workerUrl = new URL(`/assets/${match[1]}`, baseUrl).href;
    const blob = new Blob([`importScripts('${workerUrl}');`], {
      type: "application/javascript",
    });
    return new Worker(URL.createObjectURL(blob));
  }
};

/**
 * Configure Monaco Editor.
 *
 * - Vite: workers are bundled and lazy-loaded with your application (offline mode).
 * - Other bundlers: workers are loaded from CDN.
 *
 * Safe for SSR and idempotent - returns cached Monaco instance.
 */
export const configureMonaco = async (): Promise<Monaco | null> => {
  if (typeof window === "undefined") return null;
  if (monacoInstance) return monacoInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Non-Vite bundlers: use CDN-based loader
      if (!isViteBundler()) {
        monacoInstance = await loader.init();
        return monacoInstance;
      }

      // Vite bundler: offline mode with bundled workers
      const monacoModule = await import("monaco-editor");
      const monaco = (monacoModule.default ?? monacoModule) as Monaco;
      loader.config({ monaco });

      window.MonacoEnvironment = {
        getWorker: async (_moduleId: string, label: string) => {
          const key = (
            label in WORKER_LOADERS ? label : "editor"
          ) as WorkerLabel;
          const module = await WORKER_LOADERS[key]();
          return createWorker(module.default);
        },
      };

      monacoInstance = monaco;
      return monaco;
    } catch (error) {
      initPromise = null; // Allow retry on failure
      throw error;
    }
  })();

  return initPromise;
};
