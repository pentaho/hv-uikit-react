export type HvSpace = "xxs" | "xs" | "sm" | "md" | "lg" | "xl";

export type HvSize = "xs" | "sm" | "md" | "lg" | "xl";

/** @experimental extendable theme spacing units */
export interface HvThemeSpace extends Record<HvSpace, string> {
  base: number;
}

export const space: HvThemeSpace = {
  base: 8,
  xxs: "4px",
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "48px",
  xl: "80px",
};
