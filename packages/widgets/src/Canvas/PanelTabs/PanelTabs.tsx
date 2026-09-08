import { forwardRef } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-core";

import { staticClasses, useClasses } from "./PanelTabs.styles";

export { staticClasses as canvasPanelTabsClasses };

export type HvCanvasPanelTabsClasses = ExtractNames<typeof useClasses>;

type HvCanvasPanelTabsOnChange = (
  event: React.SyntheticEvent | null,
  value: Tabs.Tab.Value,
) => void;

export interface HvCanvasPanelTabsProps extends Omit<
  Tabs.Root.Props,
  "onValueChange" | "onChange"
> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasPanelTabsClasses;
  /**
   * If `true`, the selected tab changes on arrow key focus.
   * @deprecated Use `activateOnFocus` behavior from Base UI Tabs list.
   */
  selectionFollowsFocus?: boolean;
  /** Callback triggered when the value changes. */
  onChange?: HvCanvasPanelTabsOnChange;
}

/**
 * A tabs component to use in a canvas context.
 */
export const HvCanvasPanelTabs = forwardRef<
  HTMLDivElement,
  HvCanvasPanelTabsProps
>(function HvCanvasPanelTabs(props, ref) {
  const {
    selectionFollowsFocus = true,
    onChange,
    children,
    className,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvCanvasPanelTabs", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <Tabs.Root
      ref={ref}
      className={cx(classes.root, className)}
      onValueChange={(value, eventDetails) => {
        onChange?.(
          (eventDetails.event as unknown as React.SyntheticEvent | undefined) ??
            null,
          value,
        );
      }}
      {...others}
    >
      <Tabs.List
        className={classes.list}
        activateOnFocus={selectionFollowsFocus}
      >
        {children}
      </Tabs.List>
    </Tabs.Root>
  );
});
