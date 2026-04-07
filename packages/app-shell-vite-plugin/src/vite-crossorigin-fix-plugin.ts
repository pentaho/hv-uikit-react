import type { OutputBundle } from "rollup";
import type { PluginOption } from "vite";

const replacer = (match: string) =>
  match.replace(
    /crossorigin(?!\s*=\s*["'][^"']*["'])/gi,
    'crossorigin="use-credentials"',
  );

export function addUseCredentials(scriptSrc: string, html: string) {
  const escapedScriptSrc = scriptSrc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return (
    html
      .replace(
        // src attribute ending with scriptSrc
        new RegExp(
          `<script(?:\\s+\\w+(?:=(?:"[^"]*"|'[^']*'))?)*\\s+src=(?:"[^"]*${escapedScriptSrc}"|'[^']*')(?:\\s+\\w+(?:=(?:"[^"]*"|'[^']*'))?)*\\s*>`,
          "gi",
        ),
        replacer,
      )
      // the same for <link rel="modulepreload" crossorigin href=""> tags
      .replace(
        // href attribute ending with scriptSrc
        new RegExp(
          `<link(?:\\s+\\w+(?:=(?:"[^"]*"|'[^']*'))?)*\\s+rel=(?:"modulepreload"|'modulepreload')(?:\\s+\\w+(?:=(?:"[^"]*"|'[^']*'))?)*\\s+href=(?:"[^"]*${escapedScriptSrc}"|'[^']*')(?:\\s+\\w+(?:=(?:"[^"]*"|'[^']*'))?)*\\s*>`,
          "gi",
        ),
        replacer,
      )
  );
}

function processScript(
  bundle: OutputBundle,
  scriptSrc: string,
  html: string,
  seen: Set<string> = new Set(),
) {
  seen.add(scriptSrc);

  const script = bundle[scriptSrc];
  if (!script || script.type !== "chunk") {
    return html;
  }

  let newHtml = addUseCredentials(script.fileName, html);

  script.imports.forEach((importedScript) => {
    if (!seen.has(importedScript)) {
      newHtml = processScript(bundle, importedScript, newHtml, seen);
    }
  });

  return newHtml;
}

export const externalRE = /^(https?:)?\/\//;
export const isExternalUrl = (url: string): boolean => externalRE.test(url);

export const dataUrlRE = /^\s*data:/i;
export const isDataUrl = (url: string): boolean => dataUrlRE.test(url);

const isExcludedUrl = (url: string) =>
  url[0] === "#" || isExternalUrl(url) || isDataUrl(url);

export function checkCrossOrigin(html: string) {
  // before the html is transformed, we need to check if any of the
  // entrypoint's scripts that will be bundled have crossorigin="use-credentials"

  // search for script tags with crossorigin attribute set to use-credentials
  const scriptTagsWithCors = html.match(
    /<script(?:\s+\w+(?:=(?:"[^"]*"|'[^']*'))?)*\s+crossorigin=(?:"use-credentials"|'use-credentials')(?:\s+\w+(?:=(?:"[^"]*"|'[^']*'))?)*\s*>/gi,
  );

  // ignore the script tags that are not modules
  const modulesWithCors = scriptTagsWithCors?.filter((script) =>
    /type\s*=\s*(?:"module"|'module')/i.test(script),
  );

  const withCredentials = [];
  if (modulesWithCors != null && modulesWithCors.length !== 0) {
    for (let i = 0; i !== modulesWithCors.length; i += 1) {
      const src = modulesWithCors[i].match(/src="([^"]*)"|src='([^']*)'/i);

      // only take into consideration valid non-external and non-data urls
      if (src != null && !isExcludedUrl(src[1] || src[2])) {
        withCredentials.push(src[1] || src[2]);
      }
    }
  }

  return withCredentials;
}

const fixCrossOrigin = (): PluginOption => {
  const withCredentials: Record<string, string[]> = {};

  return [
    {
      name: "vite-crossorigin-fix-collect-info-plugin",

      transformIndexHtml: {
        order: "pre",
        handler(html, info) {
          withCredentials[info.filename] = checkCrossOrigin(html);
        },
      },
    },
    {
      name: "vite-crossorigin-fix-replace-plugin",

      transformIndexHtml: {
        order: "post",
        handler(html, context) {
          if (context.bundle == null || context.chunk == null) {
            return html;
          }

          // it there was at least one script with crossorigin="use-credentials" in the entrypoint
          // we need to add crossorigin="use-credentials" to all the script tags of exported chunks

          const toAddUseCredentials = withCredentials[context.filename];
          if (toAddUseCredentials != null && toAddUseCredentials.length !== 0) {
            return processScript(context.bundle, context.chunk.fileName, html);
          }

          return html;
        },
      },
    },
  ];
};

export default fixCrossOrigin;
