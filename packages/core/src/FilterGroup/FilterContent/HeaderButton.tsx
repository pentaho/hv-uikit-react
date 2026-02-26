import { HvIconContainer } from "@hitachivantara/uikit-react-icons";
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
    marginLeft: `-${theme.space.sm}`,
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

export type HvHeaderButtonClasses = ExtractNames<typeof useClasses>;

type HvHeaderButtonProps = {
  onClick: HvButtonProps["onClick"];
  iconOnly?: boolean;
  count?: number;
  title?: string;
  classes?: HvHeaderButtonClasses;
} & Omit<HvButtonProps, "onClick">;

export const HvHeaderButton = (props: HvHeaderButtonProps) => {
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
      label={count}
      showCount
      classes={{
        root: classes.badgeIconOnly,
      }}
      icon={
        <HvIconButton
          onClick={onClick}
          title={title}
          disabled={disabled}
          classes={{
            root: classes.button,
          }}
          {...others}
        >
          <HvIcon name="Filters" />
        </HvIconButton>
      }
    />
  ) : (
    <HvButton
      disabled={disabled}
      variant="secondarySubtle"
      onClick={onClick}
      startIcon={
        <HvIconContainer>
          <HvIcon name="Filters" />
        </HvIconContainer>
      }
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
};
