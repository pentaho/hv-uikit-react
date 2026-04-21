import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { HvButton, type HvButtonProps } from "../Button";
import { HvTooltip, type HvTooltipProps } from "../Tooltip";
import {
  fixedForwardRef,
  type PolymorphicComponentRef,
  type PolymorphicRef,
} from "../types/generic";

export type HvIconButtonProps<C extends React.ElementType = "button"> =
  PolymorphicComponentRef<
    C,
    Omit<
      HvButtonProps<C>,
      | "icon"
      | "focusableWhenDisabled"
      | "title"
      | "startIcon"
      | "endIcon"
      | "children"
      | "ref"
      | "component"
    > & {
      /** Label to be displayed in the tooltip when hovered. This label will be used as the button's `aria-label`. */
      title: React.ReactNode;
      /** Number of milliseconds to wait before showing the tooltip. @default 500 */
      enterDelay?: HvTooltipProps["enterDelay"];
      /** Tooltip placement. @default top */
      placement?: HvTooltipProps["placement"];
      /** Extra tooltip properties. */
      tooltipProps?: Omit<Partial<HvTooltipProps>, "children">;
    }
  >;

/**
 * The `HvIconButton` component wraps a `HvTooltip` with a label around a `HvButton` with only an icon as its content.
 * As defined by Design System, a tooltip with the button’s label should always be displayed when hovering an icon only button.
 * This component provides this behavior out of the box.
 */
export const HvIconButton = fixedForwardRef(function HvIconButton<
  C extends React.ElementType = "button",
>(props: HvIconButtonProps<C>, ref: PolymorphicRef<C>) {
  const {
    title,
    placement = "top",
    enterDelay = 500,
    tooltipProps,
    ...others
  } = useDefaultProps("HvIconButton", props);

  return (
    <HvTooltip
      title={title}
      enterDelay={enterDelay}
      placement={placement}
      {...tooltipProps}
    >
      <HvButton
        icon
        ref={ref}
        focusableWhenDisabled
        {...(others as HvButtonProps)}
      />
    </HvTooltip>
  );
});
