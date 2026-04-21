import { useMDXComponents as getThemeComponents } from "nextra-theme-docs";
import type { MDXComponents } from "nextra/mdx-components";

import { Pre } from "./components/code/Pre";

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
export function useMDXComponents(components?: MDXComponents) {
  return {
    ...themeComponents,
    pre: Pre as any,
    ...components,
  };
}
