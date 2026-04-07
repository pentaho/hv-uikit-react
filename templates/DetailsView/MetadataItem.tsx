import { css } from "@emotion/css";
import {
  HvGrid,
  HvTypography,
  theme,
  type HvGridProps,
} from "@hitachivantara/uikit-react-core";

export interface MetadataItemProps extends Omit<HvGridProps, "title"> {
  title?: React.ReactNode;
  children?: React.ReactNode;
}

export const MetadataItem = ({
  title,
  children,
  ...others
}: MetadataItemProps) => (
  <HvGrid item {...others}>
    <div
      role="group"
      className={css({
        paddingTop: theme.space.xs,
        borderTop: `1px solid ${theme.colors.border}`,
        display: "flex",
        flexFlow: "column wrap",
        gap: theme.space.xs,
      })}
    >
      {title && <HvTypography variant="label">{title}</HvTypography>}
      {children}
    </div>
  </HvGrid>
);
