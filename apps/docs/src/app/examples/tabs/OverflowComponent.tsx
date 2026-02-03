import { forwardRef } from "react";
import {
  HvBadge,
  HvButton,
  HvIconContainer,
} from "@hitachivantara/uikit-react-core";

interface OverflowComponentProps {
  count?: number;
  [key: string]: any;
}

export const OverflowComponent = forwardRef<
  HTMLDivElement,
  OverflowComponentProps
>((props, ref) => {
  const { count, ...otherProps } = props;

  if (count === 0) return null;

  return (
    <div ref={ref} {...otherProps}>
      <HvButton
        className="mt-2px font-normal"
        variant="secondaryGhost"
        endIcon={
          <HvIconContainer>
            <div className="i-ph-caret-down" />
          </HvIconContainer>
        }
      >
        More
        <HvBadge
          color="textSubtle"
          showCount
          label={count}
          classes={{ root: "ml-[-8px] mr-sm", badge: "relative" }}
        />
      </HvButton>
    </div>
  );
});
