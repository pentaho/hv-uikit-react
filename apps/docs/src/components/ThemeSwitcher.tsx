"use client";

import { usePathname } from "next/navigation";
import { HvSelect } from "@hitachivantara/uikit-react-core";

import { useDocsTheme } from "../hooks/useDocsTheme";

const themes = [
  { value: "pentahoPlus", label: "Pentaho" },
  { value: "ds5", label: "NEXT v5" },
];

const allowedPaths = [
  "/components",
  "/charts",
  "/examples",
  "/docs/color-tokens",
  "/docs/theme-tokens",
];

export const ThemeSwitcher = () => {
  const pathname = usePathname();
  const [docsTheme, setDocsTheme] = useDocsTheme();

  if (!allowedPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <HvSelect
      onChange={(e, value) => setDocsTheme(value!)}
      value={themes.find((t) => t.value === docsTheme)?.value}
      className="w-120px"
      title="Change the theme on the samples"
      options={themes}
      variant="secondaryGhost"
    />
  );
};
