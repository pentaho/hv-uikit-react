import { css } from "@emotion/css";
import { HvIconContainer } from "@hitachivantara/uikit-react-icons";
import { theme } from "@hitachivantara/uikit-styles";

import { HvBadge } from "../../Badge";
import { HvButton, HvButtonProps } from "../../Button";
import { HvIconButton } from "../../IconButton";
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
  heaaderContent: css({
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
      color="primary"
      label={count}
      showCount
      classes={{
        root: styles.iconOnly,
      }}
      icon={
        <HvIconButton
          onClick={onClick}
          title="Filters"
          disabled={disabled}
          classes={{
            root: styles.button,
          }}
          {...props}
        >
          <div className="i-ph-funnel" />
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
          <div className="i-ph-funnel" />
        </HvIconContainer>
      }
      {...props}
      role="combobox"
    >
      <div className={styles.heaaderContent}>
        <HvTypography variant="label">Filter</HvTypography>
        <HvBadge
          color="primary"
          showCount
          label={count}
          classes={{ root: styles.badgeRoot, badge: styles.badge }}
        />
      </div>
    </HvButton>
  );
};
