import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useControlled } from "../../hooks/useControlled";
import { HvBaseProps } from "../../types/generic";
import { uniqueId } from "../../utils/helpers";
import { NavigationPopupContainer } from "../NavigationPopup/NavigationPopupContainer";
import {
  HvVerticalNavigationSlider,
  HvVerticalNavigationSliderProps,
} from "../NavigationSlider";
import { getParentItemById } from "../NavigationSlider/utils";
import {
  HvVerticalNavigationTreeView,
  HvVerticalNavigationTreeViewItem,
  NavigationMode,
} from "../TreeView";
import {
  NavigationData,
  VerticalNavigationContext,
} from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./Navigation.styles";

export { staticClasses as verticalNavigationTreeClasses };

export type HvVerticalNavigationTreeClasses = ExtractNames<typeof useClasses>;

export interface HvVerticalNavigationTreeProps
  extends HvBaseProps<HTMLDivElement, "onChange" | "onToggle"> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvVerticalNavigationTreeClasses;
  /** Modus operandi (role) of the widget instance. */
  mode?: NavigationMode;
  /** Can non-leaf nodes be collapsed / expanded. */
  collapsible?: boolean;
  /** The ID of the selected page. */
  selected?: string;
  /** When uncontrolled, defines the initial selected page ID. */
  defaultSelected?: string;
  /** Callback fired when a navigation item is selected. */
  onChange?: (
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.KeyboardEvent<HTMLUListElement>,
    page: NavigationData,
  ) => void;
  /** Expanded nodes' ids. */
  expanded?: string[];
  /**
   * When uncontrolled, defines the initial expanded nodes' ids.
   *
   * It also supports `true` for starting with all nodes expanded.
   * With `false` all nodes will be collapsed.
   *
   * By default it expands the needed nodes to display the current selection, if any.
   */
  defaultExpanded?: string[] | boolean;
  /** Callback fired when tree items are expanded/collapsed. */
  onToggle?: (
    event: React.KeyboardEvent<HTMLUListElement>,
    nodeIds: string[],
  ) => void;
  /**
   * An array containing the data for each menu item.
   *
   * id - the id to be applied to the root element.
   * label - the label to be rendered on the menu item.
   * data - sub-menu items
   * href - the url used for navigation.
   * target - the behavior when opening an url.
   */
  data?: NavigationData[];
  /** Aria label to apply to the navigate to submenu button on the navigation slider list items. */
  sliderForwardButtonAriaLabel?: string;
}

const createListHierarchy = (
  items: NavigationData[],
  classes?: HvVerticalNavigationTreeClasses,
  mouseEnterHandler?: (event: any, item: any) => void,
  disableTooltip = false,
) =>
  items.map((item) => {
    const {
      id: itemId,
      label: itemLabel,
      icon,
      data: children,
      selectable,
      disabled,
      href,
      target,
    } = item;

    const itemMouseEnterHandler = (event: any) => {
      mouseEnterHandler?.(event, item);
    };

    return (
      <HvVerticalNavigationTreeViewItem
        className={classes?.listItem}
        href={href}
        target={target}
        key={itemId}
        nodeId={itemId}
        label={itemLabel}
        icon={icon}
        payload={item}
        selectable={selectable}
        disabled={disabled}
        onMouseEnter={itemMouseEnterHandler}
        disableTooltip={disableTooltip}
      >
        {children
          ? createListHierarchy(
              children,
              classes,
              mouseEnterHandler,
              disableTooltip,
            )
          : undefined}
      </HvVerticalNavigationTreeViewItem>
    );
  });

const getAllParents = (items: any) => {
  const parents = items.filter(
    (item: any) => item.data != null && item.data.length > 0,
  );
  const childParents = parents.flatMap((item: any) => getAllParents(item.data));

  return [...parents, ...childParents];
};

function pathToElement(data: any, targetId: any) {
  const path: string[] = [];

  if (data != null && data.length > 0) {
    for (let i = 0; i !== data.length; ++i) {
      const item = data[i];
      if (item.id === targetId) {
        path.push(item.id);
        break;
      }

      const subPaths = pathToElement(item.data, targetId);
      if (subPaths.length > 0) {
        path.push(item.id);
        path.push(...subPaths);
        break;
      }
    }
  }

  return path;
}

export const HvVerticalNavigationTree = (
  props: HvVerticalNavigationTreeProps,
) => {
  const {
    id,
    className,
    classes: classesProp,
    data,
    mode = "navigation",
    collapsible = false,
    expanded: expandedProp,
    defaultExpanded,
    onToggle,
    selected: selectedProp,
    defaultSelected,
    onChange,
    sliderForwardButtonAriaLabel = "Navigate to submenu",
    ...others
  } = useDefaultProps("HvVerticalNavigationTree", props);

  const { classes, cx } = useClasses(classesProp);

  const [selected, setSelected] = useControlled(selectedProp, defaultSelected);
  const [expanded, setExpanded] = useControlled(expandedProp, () => {
    if (defaultExpanded === true) {
      // all parent nodes will be expanded by default
      return getAllParents(data).map((item) => item.id);
    }

    if (defaultExpanded === false) {
      // all parent nodes will be collapsed by default
      return [];
    }

    if (defaultExpanded == null) {
      if (selected != null) {
        // the path to the selected node will be expanded (default behaviour)
        const path = pathToElement(data, selected);
        return path.slice(0, -1);
      }

      // nothing is expanded
      return [];
    }

    return defaultExpanded;
  });

  const {
    isOpen,
    useIcons,
    slider,

    parentItem,
    setParentItem,
    withParentData,
    navigateToChildHandler,

    setParentData,
    setParentSelected,
  } = useContext(VerticalNavigationContext);

  const [navigationPopup, setNavigationPopup] = useState<{
    // This value is needed to guarantee that the NavigationPopup is fully re-rendered with keeping any previous values
    uniqueKey: string;
    anchorEl: HTMLElement | null;
    fixedMode: boolean;
    data: NavigationData[];
  } | null>(null);

  const handleChange = useCallback(
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.KeyboardEvent<HTMLUListElement>,
      selectedId: string | string[],
      selectedItem: NavigationData,
    ) => {
      if (useIcons && !isOpen && selectedItem.data) {
        const currentEventTarget = event.currentTarget;
        setNavigationPopup((prevState) => {
          // We want to close the popup in case the clicked element is the same as the previous one
          return prevState?.anchorEl === currentEventTarget
            ? null
            : {
                uniqueKey: uniqueId(),
                anchorEl: currentEventTarget,
                fixedMode: true,
                data: selectedItem.data as NavigationData[],
              };
        });

        // We need this stopPropagation or else the Popup will close due to the clickaway being triggered
        event.stopPropagation();
      } else {
        setSelected(selectedId as string);
        setExpanded((prevState) => {
          if (!isOpen) {
            return [...prevState, ...pathToElement(data, selectedId)];
          }
          return [...prevState];
        });
        setNavigationPopup(null);
        onChange?.(event, selectedItem);
      }
    },
    [onChange, setSelected, setExpanded, isOpen, useIcons, data],
  );

  const treeViewItemMouseEnterHandler = useCallback(
    (event: any, item: any) => {
      const isCollapsed = useIcons && !isOpen;

      if (isCollapsed && item.data && !navigationPopup?.fixedMode) {
        const currentEventTarget = event.currentTarget;

        setNavigationPopup?.({
          uniqueKey: uniqueId(),
          anchorEl: currentEventTarget,
          fixedMode: false,
          data: item.data,
        });
      } else if (isCollapsed && !item.data && !navigationPopup?.fixedMode) {
        setNavigationPopup(null);
      }
    },
    [isOpen, useIcons, navigationPopup],
  );

  const handleToggle = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>, newExpanded: string[]) => {
      setExpanded(newExpanded);
      onToggle?.(event, newExpanded);
    },
    [onToggle, setExpanded],
  );

  const children = useMemo(
    () =>
      data &&
      createListHierarchy(
        data,
        classes,
        treeViewItemMouseEnterHandler,
        navigationPopup?.fixedMode,
      ),
    [classes, data, navigationPopup, treeViewItemMouseEnterHandler],
  );

  useEffect(() => {
    if (!isOpen) {
      setNavigationPopup?.(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (setParentSelected) setParentSelected(selected);
  }, [selected, setSelected, setParentSelected]);

  useEffect(() => {
    if (setParentData) setParentData(data);
  }, [data, setParentData]);

  useEffect(() => {
    if (
      withParentData &&
      selected &&
      setParentItem &&
      getParentItemById(withParentData, selected)
    ) {
      setParentItem(getParentItemById(withParentData, selected));
    }
  }, [withParentData, selected, setParentItem]);

  const navigateToTargetHandler: HvVerticalNavigationSliderProps["onNavigateToTarget"] =
    (event, selectedItem) => handleChange(event, selectedItem.id, selectedItem);

  const handleNavigationPopupClose = () => setNavigationPopup(null);

  const handleStyledNavMouseLeave = () => {
    if (useIcons && !isOpen && !navigationPopup?.fixedMode) {
      setNavigationPopup(null);
    }
  };

  const handleNavigationPopupMouseLeave = () => {
    if (!navigationPopup?.fixedMode) {
      handleNavigationPopupClose();
    }
  };

  const handleNavigationPopupChange: HvVerticalNavigationTreeProps["onChange"] =
    (event, selectedItem) => {
      handleChange(event, selectedItem.id, selectedItem);
    };

  return (
    <nav
      id={id}
      className={cx(
        classes.root,
        { [classes.collapsed]: !isOpen && !useIcons },
        className,
      )}
      onMouseLeave={handleStyledNavMouseLeave}
      {...others}
    >
      {slider ? (
        <HvVerticalNavigationSlider
          data={parentItem.data || withParentData}
          selected={selected}
          onNavigateToTarget={navigateToTargetHandler}
          onNavigateToChild={navigateToChildHandler}
          forwardButtonAriaLabel={sliderForwardButtonAriaLabel}
        />
      ) : (
        <HvVerticalNavigationTreeView
          className={classes.list}
          selectable
          mode={mode}
          collapsible={collapsible}
          selected={selected}
          onChange={handleChange}
          expanded={expanded}
          onToggle={handleToggle}
        >
          {useIcons && !isOpen && navigationPopup && (
            <NavigationPopupContainer
              anchorEl={navigationPopup.anchorEl}
              onClose={handleNavigationPopupClose}
              key={navigationPopup.uniqueKey}
              className={classes.navigationPopup}
            >
              <HvVerticalNavigationTree
                className={classes.popup}
                collapsible
                defaultExpanded
                selected={selected}
                data={navigationPopup.data}
                onChange={handleNavigationPopupChange}
                onMouseLeave={handleNavigationPopupMouseLeave}
              />
            </NavigationPopupContainer>
          )}
          {children}
        </HvVerticalNavigationTreeView>
      )}
    </nav>
  );
};
