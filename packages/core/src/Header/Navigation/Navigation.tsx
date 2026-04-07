import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import { HvHeaderMenuBar, type HvHeaderMenuBarProps } from "./MenuBar";
import { staticClasses, useClasses } from "./Navigation.styles";
import {
  useSelectionPath,
  type HvHeaderNavigationItemProp,
} from "./useSelectionPath";
import { FocusProvider } from "./utils/FocusContext";
import { SelectionContext } from "./utils/SelectionContext";

export { staticClasses as headerNavigationClasses };

export type HvHeaderNavigationClasses = ExtractNames<typeof useClasses>;

export interface HvHeaderNavigationProps
  extends HvBaseProps<HTMLDivElement, "onClick"> {
  data: HvHeaderNavigationItemProp[];
  selected?: string;
  onClick?: (
    event: React.MouseEvent,
    selection: HvHeaderNavigationItemProp,
  ) => void;
  classes?: HvHeaderNavigationClasses;
  /**
   * The number of levels to show: the first level (1) or the first and second level (2).
   *
   * Defaults to `2`.
   * */
  levels?: 1 | 2;
}

export const HvHeaderNavigation = forwardRef<
  React.ElementRef<"nav">,
  HvHeaderNavigationProps
>(function HvHeaderNavigation(props, ref) {
  const {
    data,
    selected,
    onClick,
    className,
    classes: classesProp,
    levels = 2,
    ...others
  } = useDefaultProps("HvHeaderNavigation", props);

  const { classes, cx } = useClasses(classesProp);

  const selectionPath = useSelectionPath(data, selected);

  const handleClick: HvHeaderMenuBarProps["onClick"] = (event, selection) => {
    event.preventDefault();

    onClick?.(event, selection);
  };

  return (
    <SelectionContext.Provider value={selectionPath}>
      <FocusProvider>
        <nav ref={ref} className={cx(classes.root, className)} {...others}>
          <HvHeaderMenuBar
            data={data}
            type="menubar"
            onClick={handleClick}
            levels={levels}
            currentLevel={1}
          />
        </nav>
      </FocusProvider>
    </SelectionContext.Provider>
  );
});
