import { css } from "@emotion/css";
import { HvIconContainer } from "@hitachivantara/uikit-react-icons";
import { theme } from "@hitachivantara/uikit-styles";

import { HvBadge } from "../../Badge";
import { HvButton, HvButtonProps } from "../../Button";
import { HvIconButton } from "../../IconButton";
import { HvIcon } from "../../icons";
import { HvTypography } from "../../Typography";

type HeaderButtonProps = {
  onClick: HvButtonProps["onClick"];
  iconOnly?: boolean;
  count?: number;
  title?: string;
} & Omit<HvButtonProps, "onClick">;

const styles = {
  iconOnly: css({
    "& > .HvBadge-badge": {
      minWidth: "unset !important",
      minHeight: "unset !important",
    },
  }),
  button: css({
    border: `1px solid ${theme.colors.primaryDimmed}`,
    borderRadius: theme.radii.full,
  }),
  headerContent: css({
    display: "flex",
    alignItems: "center",
    gap: theme.space.xxs,
  }),
  badgeRoot: css({
    width: 0,
    marginRight: theme.space.sm,
    marginLeft: `-${theme.space.sm}`,
  }),
  badge: css({
    position: "relative",
  }),
  badgeIconOnly: css({
    "&&>div:last-of-type": {
      minWidth: "unset",
      minHeight: "unset",
    },
  }),
  badgeIcon: css({
    minHeight: 0,
    minWidth: 0,
  }),
};

export const HeaderButton = ({
  onClick,
  iconOnly,
  count = 0,
  disabled,
  title = "Filters",
  ...props
}: HeaderButtonProps) => {
  return iconOnly ? (
    <HvBadge
      label={count}
      showCount
      classes={{
        root: styles.badgeIconOnly,
      }}
      icon={
        <HvIconButton
          onClick={onClick}
          title={title}
          disabled={disabled}
          classes={{
            root: styles.button,
          }}
          {...props}
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
      {...props}
      role="combobox"
    >
      <div className={styles.headerContent}>
        <HvTypography variant="label">Filter</HvTypography>
        <HvBadge
          showCount
          label={count}
          classes={{
            root: styles.badgeRoot,
            badge: styles.badge,
            badgeIcon: styles.badgeIcon,
          }}
        />
      </div>
    </HvButton>
  );
};
