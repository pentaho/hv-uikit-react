import { compile } from "path-to-regexp";

/**
 * Utility that replaces the href placeholders with the href options provided.
 * The href parameter must not contain 'search' nor 'hash' parts.
 * @example
 * compileHref('/home/:id', {id: 2}); // -> '/home/2'
 *
 * @param href The string to be compiled.
 * @param hrefOptions The options to replace the placeholders on the href.
 *
 * @returns The compiled href
 */
const compileHref = (
  href: string,
  hrefOptions?: Record<string, string>,
): string => {
  if (!hrefOptions) {
    return href;
  }

  const compiler = compile(href);

  return compiler(hrefOptions);
};

export default compileHref;
