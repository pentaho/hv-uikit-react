/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { loader, type Monaco } from "@monaco-editor/react";
import type { Environment } from "monaco-editor";

// Singleton state
let monacoInstance: Monaco | null = null;
let initPromise: Promise<Monaco> | null = null;

/**
 * Detects if the application is using Vite bundler
 */
const isViteBundler = (): boolean => {
  return (
    // oxlint-disable-next-line no-typeof-undefined
    typeof import.meta !== "undefined" && import.meta.url?.includes("http://")
  );
};

type WorkerLabel = "json" | "css" | "html" | "typescript" | "javascript";

/**
 * Configure Monaco Editor.
 * For Vite: workers are bundled with your application.
 * For other bundlers: workers are loaded from CDN.
 * Safe for SSR and safe to call multiple times. Returns cached Monaco instance.
 */
export const configureMonaco = async (): Promise<Monaco | null> => {
  // SSR guard
  if (typeof window === "undefined") return null;

  // Return cached instance
  if (monacoInstance) return monacoInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      if (!isViteBundler()) {
        // Not Vite: fallback to CDN-based loader
        monacoInstance = await loader.init();
        return monacoInstance;
      }

      // Vite: bundle workers
      const monacoNs = await import("monaco-editor");
      const monaco = monacoNs.default ?? monacoNs;
      loader.config({ monaco });

      // Configure workers
      const [editorWorker, jsonWorker, cssWorker, htmlWorker, tsWorker] =
        await Promise.all([
          import("monaco-editor/esm/vs/editor/editor.worker?worker"),
          import("monaco-editor/esm/vs/language/json/json.worker?worker"),
          import("monaco-editor/esm/vs/language/css/css.worker?worker"),
          import("monaco-editor/esm/vs/language/html/html.worker?worker"),
          import("monaco-editor/esm/vs/language/typescript/ts.worker?worker"),
        ]);

      const workerMap = {
        json: jsonWorker,
        css: cssWorker,
        html: htmlWorker,
        typescript: tsWorker,
        javascript: tsWorker,
        default: editorWorker,
      };

      window.MonacoEnvironment = {
        getWorker: (_moduleId: string, label: string) => {
          const worker = workerMap[label as WorkerLabel] ?? workerMap.default;
          return new worker.default();
        },
      } satisfies Environment;

      monacoInstance = monaco;
      return monaco;
    } catch (error) {
      console.error("Monaco initialization failed:", error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
};
