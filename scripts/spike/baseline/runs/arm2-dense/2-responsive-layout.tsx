import type { ReactNode } from "react";
import { HvGrid } from "@pentaho/uikit-react-core";

export interface ResponsiveLayoutProps {
  /** Content rendered in the first column. */
  first?: ReactNode;
  /** Content rendered in the second column. */
  second?: ReactNode;
  /** Content rendered in the third column. */
  third?: ReactNode;
}

/**
 * A three-column layout that collapses to a single column on small screens,
 * with 24px gutters between columns (spacing={3} => 3 * 8px).
 */
export function ResponsiveLayout({
  first = <div>Column 1</div>,
  second = <div>Column 2</div>,
  third = <div>Column 3</div>,
}: ResponsiveLayoutProps) {
  return (
    <HvGrid container spacing={3}>
      <HvGrid size={{ xs: 12, md: 4 }}>{first}</HvGrid>
      <HvGrid size={{ xs: 12, md: 4 }}>{second}</HvGrid>
      <HvGrid size={{ xs: 12, md: 4 }}>{third}</HvGrid>
    </HvGrid>
  );
}

export default ResponsiveLayout;
