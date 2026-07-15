import {
  createClasses,
  HvSection,
  HvTypography,
  theme,
  type HvSectionProps,
} from "@hitachivantara/uikit-react-core";

import { useLocalStorageState } from "../hooks/useLocalStorage";
import { MetadataGrid } from "./MetadataGrid";

const { useClasses } = createClasses("MetadataSection", {
  root: {
    ":has(>.HvSection-header) .HvSection-content": {
      backgroundColor: theme.colors.bgPage,
    },
  },
  contentGrid: {
    padding: theme.space.xs,
  },
});

export interface MetadataSectionProps extends HvSectionProps {
  /** The ID used to store the expanded state in local storage */
  storageId?: string;
  variant?: "grid";
}

/**
 * A `HvSection` wrapper that's styled for the Metadata sidebar.
 * Supports saving expanded state via `storageId`, and multiple `variant` layouts.
 *
 * **NOTE**: Use inside the `MetadataContainer` component.
 */
export function MetadataSection({
  storageId,
  variant,
  className,
  title,
  onToggle,
  children,
  defaultExpanded,
  ...others
}: MetadataSectionProps) {
  const { classes, cx } = useClasses();
  const [expanded, setExpanded] = useLocalStorageState(
    storageId,
    defaultExpanded,
  );

  return (
    <HvSection
      raisedHeader
      expandableHeader
      expanded={expanded}
      expandable={!!storageId}
      className={cx(classes.root, className)}
      title={title && <HvTypography variant="title4">{title}</HvTypography>}
      onToggle={(evt, newExpanded) => {
        setExpanded(newExpanded);
        onToggle?.(evt, newExpanded);
      }}
      classes={{
        content: variant === "grid" ? classes.contentGrid : "",
      }}
      {...others}
    >
      {variant === "grid" ? <MetadataGrid>{children}</MetadataGrid> : children}
    </HvSection>
  );
}
