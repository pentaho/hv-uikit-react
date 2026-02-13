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
};

const styles = {
  iconOnly: css({
    "& > .HvBadge-badge": {
      minWidth: "unset!important",
      minHeight: "unset!important",
    },
  }),
  button: css({
    border: `1px solid ${theme.colors.primaryDimmed}`,
    borderRadius: theme.radii.full,
  }),
};

export const HeaderButton = ({
  onClick,
  iconOnly,
  count = 0,
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
      variant="secondarySubtle"
      onClick={onClick}
      startIcon={
        <HvIconContainer>
          <div className="i-ph-funnel" />
        </HvIconContainer>
      }
      {...props}
    >
      <div className="flex items-center gap-xxs">
        <HvTypography variant="label">Filters</HvTypography>
        <HvBadge
          color="primary"
          showCount
          label={count}
          classes={{ root: "w-0, mr-sm ml-[-16px]", badge: "relative" }}
        />
      </div>
    </HvButton>
  );
};
