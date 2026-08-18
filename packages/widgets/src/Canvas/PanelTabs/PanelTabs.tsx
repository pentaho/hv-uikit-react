import { forwardRef } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-core";

import { staticClasses, useClasses } from "./PanelTabs.styles";

export { staticClasses as canvasPanelTabsClasses };

export type HvCanvasPanelTabsClasses = ExtractNames<typeof useClasses>;

export interface HvCanvasPanelTabsProps extends Omit<
  Tabs.Root.Props,
  "onValueChange" | "onChange"
> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasPanelTabsClasses;
  /**
   * Whether focused tabs are automatically activated when using arrow keys.
   *
   * Maps to Base UI `Tabs.List` `activateOnFocus`.
   */
  selectionFollowsFocus?: boolean;
  /** Callback triggered when changing tab. */
  onChange?: (event: any, value: any) => void;
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
    children,
    className,
    classes: classesProp,
    onChange,
    ...others
  } = useDefaultProps("HvCanvasPanelTabs", props);

  const { classes, cx } = useClasses(classesProp);

  const handleValueChange: Tabs.Root.Props["onValueChange"] = (
    value,
    eventDetails,
  ) => {
    onChange?.(eventDetails.event ?? null, value);
  };

  return (
    <Tabs.Root
      ref={ref}
      className={cx(classes.root, className)}
      onValueChange={handleValueChange}
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
