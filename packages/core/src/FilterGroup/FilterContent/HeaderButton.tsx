import { forwardRef } from "react";
import {
  createClasses,
  ExtractNames,
  useDefaultProps,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvBadge } from "../../Badge";
import { HvButton, HvButtonProps } from "../../Button";
import { HvIconButton } from "../../IconButton";
import { HvIcon } from "../../icons";
import { HvTypography } from "../../Typography";

const { useClasses } = createClasses("HvHeaderButton", {
  iconOnly: {
    "& > .HvBadge-badge": {
      minWidth: "unset !important",
      minHeight: "unset !important",
    },
  },
  button: {
    border: `1px solid ${theme.colors.primaryDimmed}`,
    borderRadius: theme.radii.full,
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    gap: theme.space.xxs,
  },
  badgeRoot: {
    width: 0,
    marginRight: theme.space.sm,
  },
  badge: {
    position: "relative",
  },
  badgeIconOnly: {
    "&&>div:last-of-type": {
      minWidth: "unset",
      minHeight: "unset",
    },
  },
  badgeIcon: {
    minHeight: 0,
    minWidth: 0,
  },
});

interface HvHeaderButtonProps extends Omit<HvButtonProps, "classes"> {
  iconOnly?: boolean;
  count?: number;
  title?: string;
  classes?: ExtractNames<typeof useClasses>;
}

export const HvHeaderButton = forwardRef<
  // no-indent
  HTMLElement,
  HvHeaderButtonProps
>((props, ref) => {
  const {
    onClick,
    iconOnly,
    count = 0,
    disabled,
    title = "Filter",
    classes: classesProp,
    ...others
  } = useDefaultProps("HvHeaderButton", props);
  const { classes } = useClasses(classesProp, false);

  return iconOnly ? (
    <HvBadge
      ref={ref as any}
      label={count}
      showCount
      className={classes.badgeIconOnly}
      icon={
        <HvIconButton
          onClick={onClick}
          title={title}
          disabled={disabled}
          className={classes.button}
          {...others}
        >
          <HvIcon name="Filters" />
        </HvIconButton>
      }
    />
  ) : (
    <HvButton
      ref={ref as any}
      disabled={disabled}
      variant="secondarySubtle"
      onClick={onClick}
      startIcon={<HvIcon name="Filters" />}
      {...others}
      role="combobox"
    >
      <div className={classes.headerContent}>
        <HvTypography variant="label">{title}</HvTypography>
        <HvBadge
          showCount
          label={count}
          classes={{
            root: classes.badgeRoot,
            badge: classes.badge,
            badgeIcon: classes.badgeIcon,
          }}
        />
      </div>
    </HvButton>
  );
});
