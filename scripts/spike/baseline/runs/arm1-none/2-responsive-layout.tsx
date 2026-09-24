import type { ReactNode } from "react";
import { HvGrid } from "@hitachivantara/uikit-react-core";

export interface ResponsiveThreeColumnLayoutProps {
  /** Content rendered in the first column. */
  left: ReactNode;
  /** Content rendered in the second column. */
  middle: ReactNode;
  /** Content rendered in the third column. */
  right: ReactNode;
}

/**
 * Three-column layout that collapses to a single column on small screens.
 * Gutters between columns/rows are 24px (spacing unit is 8px, so `3` -> 24px).
 */
export function ResponsiveThreeColumnLayout({
  left,
  middle,
  right,
}: ResponsiveThreeColumnLayoutProps) {
  return (
    <HvGrid container columnSpacing={3} rowSpacing={3}>
      <HvGrid xs={12} sm={12} md={4}>
        {left}
      </HvGrid>
      <HvGrid xs={12} sm={12} md={4}>
        {middle}
      </HvGrid>
      <HvGrid xs={12} sm={12} md={4}>
        {right}
      </HvGrid>
    </HvGrid>
  );
}

export default ResponsiveThreeColumnLayout;
