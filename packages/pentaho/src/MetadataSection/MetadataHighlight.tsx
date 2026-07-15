import { forwardRef } from "react";
import {
  createClasses,
  HvButtonBase,
  HvStatusIcon,
  HvTypography,
  type ExtractNames,
  type HvButtonBaseProps,
} from "@hitachivantara/uikit-react-core";

const { useClasses } = createClasses("MetadataHighlight", {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
});

export interface MetadataHighlightProps extends HvButtonBaseProps {
  classes?: ExtractNames<typeof useClasses>;
  icon: React.ReactNode;
  label?: string;
  /** @deprecated use `label` instead */
  title?: string;
  value: string;
}

export const MetadataHighlight = forwardRef<
  HTMLButtonElement,
  MetadataHighlightProps
>(function MetadataHighlight(props, ref) {
  const {
    className,
    classes: classesProp,
    icon,
    label,
    title,
    value,
    ...others
  } = props;
  const { classes, cx } = useClasses(classesProp);
  return (
    <HvButtonBase ref={ref} className={cx(classes.root, className)} {...others}>
      <HvStatusIcon size="sm" type="simple" customIcon={icon} />
      <div className={classes.content}>
        <HvTypography variant="label">{label ?? title}</HvTypography>
        <HvTypography variant="body">{value}</HvTypography>
      </div>
    </HvButtonBase>
  );
});
