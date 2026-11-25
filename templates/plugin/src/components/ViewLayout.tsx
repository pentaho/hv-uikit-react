// The layout every view of the plugin shares, as its Figma screens frame it: the App Shell gives the 48px header and
// no gutters (mainPanel disableGutters, like the platform's own plugins), so the view pads itself with space.md (the
// page padding), stacks its parts space.md apart, and opens with its h1 (title2 style), its description space.sm below
// and the view's primary action, if any, on the title's right.
import type { ReactNode } from "react";
import { HvTypography } from "@pentaho/uikit-react-core";

export function ViewLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  /** The view's primary action (an HvButton, or a few), beside the title. */
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-md p-md">
      <div className="flex flex-wrap items-start justify-between gap-md">
        <div className="flex flex-col gap-sm">
          <HvTypography variant="title2" component="h1">
            {title}
          </HvTypography>
          {description ? <HvTypography>{description}</HvTypography> : null}
        </div>
        {actions ? <div className="flex gap-sm">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}
