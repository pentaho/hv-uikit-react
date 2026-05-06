import { forwardRef, useCallback, useMemo, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import {
  fillDataWithParentId,
  getNavigationItemById,
  getParentItemById,
} from "./NavigationSlider/utils";
import { staticClasses, useClasses } from "./VerticalNavigation.styles";
import {
  VerticalNavigationContext,
  type NavigationData,
} from "./VerticalNavigationContext";

export { staticClasses as verticalNavigationClasses };

export type HvVerticalNavigationClasses = ExtractNames<typeof useClasses>;

export type HvVerticalNavigationMode = "icon" | "simple";

export type HvVerticalNavigationPosition =
  | "static"
  | "relative"
  | "fixed"
  | "absolute";

export interface HvVerticalNavigationProps extends HvBaseProps {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvVerticalNavigationClasses;
  /** Current State of the Vertical Navigation Collapse */
  open?: boolean;
  /**
   * Collapsed Mode for the Vertical Navigation, the default value is "simple".
   *
   * @deprecated - `useIcons` property should be used instead.
   */
  collapsedMode?: HvVerticalNavigationMode;
  /** Boolean to determine if treeview is in slider mode (for mobile navigation), the default value is false. */
  slider?: boolean;
  /**
   * Boolean to determine if icons should be displayed in the navigation menu.
   * When `true` a icon will always be displayed, if no icon is provided the first letter of the label will be
   * displayed inside an Avatar component.
   * When `false` no icons will be shown, even if an icon is provided.
   */
  useIcons?: boolean;
}

/**
 * Use a vertical layout for global navigation on wide screens. treeview mode provides structured hierarchy but overrides standard keyboard navigation.
 */
export const HvVerticalNavigation = forwardRef<
  HTMLDivElement,
  HvVerticalNavigationProps
>(function HvVerticalNavigation(props, ref) {
  const {
    id,
    className,
    classes: classesProp,
    children,
    open = true,
    slider = false,
    useIcons = false,
    ...others
  } = useDefaultProps("HvVerticalNavigation", props);
  const { classes, cx } = useClasses(classesProp);

  const [parentData, setParentData] = useState<NavigationData[]>([]);

  const [parentSelected, setParentSelected] = useState();

  // navigationSlider
  const withParentData = useMemo(
    () => fillDataWithParentId(parentData),
    [parentData],
  );

  const initialParentItem = useMemo(
    () => getParentItemById(withParentData, parentSelected),
    [withParentData, parentSelected],
  );

  const [parentItem, setParentItem] = useState(initialParentItem);

  /** Checks if there are any sub items in the NavigationItem data structure. */
  const hasAnyChildWithData = useMemo(
    () => parentData.some((item) => item.data && item.data.length > 0),
    [parentData],
  );

  const headerTitle = useMemo(() => parentItem?.label, [parentItem]);

  const navigateToParentHandler = useCallback(() => {
    setParentItem(getParentItemById(withParentData, parentItem.id));
  }, [parentItem, withParentData]);

  const navigateToChildHandler = useCallback(
    (event: any, item: any) => {
      setParentItem(getNavigationItemById(withParentData, item.id));
      event.stopPropagation();
    },
    [withParentData],
  );

  const value = useMemo(
    () => ({
      isOpen: open,
      useIcons,
      slider,
      headerTitle,

      parentItem,
      setParentItem,
      withParentData,
      navigateToChildHandler,
      navigateToParentHandler,

      parentData,
      setParentData,
      parentSelected,
      setParentSelected,
      hasAnyChildWithData,
    }),
    [
      open,
      useIcons,
      slider,
      headerTitle,
      parentItem,
      setParentItem,
      withParentData,
      navigateToChildHandler,
      navigateToParentHandler,
      hasAnyChildWithData,
      parentData,
      parentSelected,
    ],
  );

  return (
    <VerticalNavigationContext.Provider value={value}>
      <div
        id={id}
        ref={ref}
        className={cx(
          classes.root,
          {
            [classes.collapsed]: !open,
            [classes.slider]: slider,
            [classes.childData]: hasAnyChildWithData,
          },
          className,
        )}
        {...others}
      >
        {children}
      </div>
    </VerticalNavigationContext.Provider>
  );
});
