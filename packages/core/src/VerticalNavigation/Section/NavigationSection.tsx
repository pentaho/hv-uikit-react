import { useCallback, useContext, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../../Button";
import { useControlled } from "../../hooks/useControlled";
import { useLabels } from "../../hooks/useLabels";
import type { HvBaseProps } from "../../types/generic";
import { uniqueId } from "../../utils/helpers";
import { HvVerticalNavigationTree } from "../Navigation";
import type { HvVerticalNavigationTreeProps } from "../Navigation";
import { NavigationPopupContainer } from "../NavigationPopup/NavigationPopupContainer";
import {
  HvVerticalNavigationTreeView,
  HvVerticalNavigationTreeViewItem,
  type NavigationMode,
} from "../TreeView";
import type { NavigationData } from "../VerticalNavigationContext";
import { VerticalNavigationContext } from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./NavigationSection.styles";

export { staticClasses as verticalNavigationSectionClasses };

export type HvVerticalNavigationSectionClasses = ExtractNames<
  typeof useClasses
>;

const DEFAULT_LABELS = {
  /** Label for the button that expands the truncated item list. */
  seeAll: "See All",
  /** Label for the button that collapses the expanded item list. */
  seeLess: "See Less",
};

export type HvVerticalNavigationSectionLabels = Partial<typeof DEFAULT_LABELS>;

export interface HvVerticalNavigationSectionProps extends HvBaseProps<
  HTMLElement,
  "onChange" | "onToggle"
> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvVerticalNavigationSectionClasses;
  /** Modus operandi (role) of the widget instance. */
  mode?: NavigationMode;
  /** Can non-leaf nodes be collapsed / expanded. */
  collapsible?: boolean;
  /** The ID of the selected item. */
  selected?: string;
  /** When uncontrolled, defines the initial selected item ID. */
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
   * Supports `true` to start with all nodes expanded, `false` to collapse all.
   * By default expands the path to the current selection, if any.
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
   * icon - the icon react element.
   * data - sub-menu items.
   * href - the url used for navigation.
   * target - the behavior when opening a url.
   */
  data?: NavigationData[];
  /** Labels for the component's interactive elements. */
  labels?: HvVerticalNavigationSectionLabels;
}

const getAllParents = (items: NavigationData[]): NavigationData[] => {
  const parents = items.filter(
    (item) => item.data != null && item.data.length > 0,
  );
  const childParents = parents.flatMap((item) => getAllParents(item.data!));
  return [...parents, ...childParents];
};

function pathToElement(
  data: NavigationData[] | undefined,
  targetId: string,
): string[] {
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

const MAX_VISIBLE = 5;

const NavigationItemChildren = ({
  items,
  classes,
  labels,
}: {
  items: NavigationData[];
  classes?: HvVerticalNavigationSectionClasses;
  labels: HvVerticalNavigationSectionLabels;
}) => {
  const [showAll, setShowAll] = useState(false);
  const hasMore = items.length > MAX_VISIBLE;
  const visibleItems = items.slice(0, MAX_VISIBLE);
  const extraItems = items.slice(MAX_VISIBLE);

  return (
    <>
      {createListHierarchy(visibleItems, classes)}
      {hasMore && (
        <>
          <div
            className={classes?.extraItemsWrapper}
            style={{ gridTemplateRows: showAll ? "1fr" : "0fr" }}
            aria-hidden={!showAll || undefined}
          >
            <div className={classes?.extraItems}>
              {createListHierarchy(extraItems, classes)}
            </div>
          </div>
          <HvButton
            className={classes?.seeAll}
            variant="secondarySubtle"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? labels.seeLess : labels.seeAll}
          </HvButton>
        </>
      )}
    </>
  );
};

const createListHierarchy = (
  items: NavigationData[],
  classes?: HvVerticalNavigationSectionClasses,
  labels?: HvVerticalNavigationSectionLabels,
  mouseEnterHandler?: (event: any, item: NavigationData) => void,
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
        onMouseEnter={
          mouseEnterHandler
            ? (e: React.MouseEvent) => mouseEnterHandler(e, item)
            : undefined
        }
      >
        {children ? (
          <NavigationItemChildren
            items={children}
            classes={classes}
            labels={labels ?? DEFAULT_LABELS}
          />
        ) : undefined}
      </HvVerticalNavigationTreeViewItem>
    );
  });

/**
 * A standalone navigation section that renders a group of tree-view items above
 * (or below) the main `HvVerticalNavigationTree`. Unlike `HvVerticalNavigationTree`
 * it does not participate in slider or popup coordination — it simply renders
 * its items using the shared context for open/icon state.
 */
export const HvVerticalNavigationSection = (
  props: HvVerticalNavigationSectionProps,
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
    labels: labelsProp,
    ...others
  } = useDefaultProps("HvVerticalNavigationSection", props);

  const { classes, cx } = useClasses(classesProp);

  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  const {
    isOpen,
    useIcons,
    selected: contextSelected,
    setSelected: contextSetSelected,
  } = useContext(VerticalNavigationContext);

  const [navigationPopup, setNavigationPopup] = useState<{
    uniqueKey: string;
    anchorEl: HTMLElement | null;
    fixedMode: boolean;
    data: NavigationData[];
  } | null>(null);

  const treeViewItemMouseEnterHandler = useCallback(
    (event: any, item: NavigationData) => {
      const isCollapsed = useIcons && !isOpen;
      if (isCollapsed && item.data && !navigationPopup?.fixedMode) {
        setNavigationPopup({
          uniqueKey: uniqueId(),
          anchorEl: event.currentTarget,
          fixedMode: false,
          data: item.data,
        });
      } else if (isCollapsed && !item.data && !navigationPopup?.fixedMode) {
        setNavigationPopup(null);
      }
    },
    [isOpen, useIcons, navigationPopup],
  );

  const [localSelected, setLocalSelected] = useControlled(
    selectedProp,
    defaultSelected,
  );

  // Use context selection when no prop is provided by the consumer
  const selected =
    selectedProp === undefined && contextSelected !== undefined
      ? contextSelected
      : localSelected;
  const [expanded, setExpanded] = useControlled(expandedProp, () => {
    if (defaultExpanded === true) {
      return getAllParents(data ?? []).map((item) => item.id);
    }
    if (defaultExpanded === false) {
      return [];
    }
    if (defaultExpanded == null) {
      if (selected != null) {
        const path = pathToElement(data, selected);
        return path.slice(0, -1);
      }
      return [];
    }
    return defaultExpanded;
  });

  const handleChange = useCallback(
    (
      event:
        | React.MouseEvent<HTMLLIElement>
        | React.KeyboardEvent<HTMLUListElement>,
      selectedId: string | string[],
      selectedItem: NavigationData,
    ) => {
      if (useIcons && !isOpen && selectedItem.data) {
        const currentEventTarget = event.currentTarget as HTMLElement;
        setNavigationPopup((prev) =>
          prev?.anchorEl === currentEventTarget
            ? null
            : {
                uniqueKey: uniqueId(),
                anchorEl: currentEventTarget,
                fixedMode: true,
                data: selectedItem.data as NavigationData[],
              },
        );
        event.stopPropagation();
      } else {
        setLocalSelected(selectedItem.id);
        contextSetSelected?.(selectedItem.id);
        setNavigationPopup(null);
        onChange?.(event as React.MouseEvent<HTMLLIElement>, selectedItem);
      }
    },
    [onChange, setLocalSelected, contextSetSelected, isOpen, useIcons],
  );

  const handleToggle = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>, nodeIds: string[]) => {
      setExpanded(nodeIds);
      onToggle?.(event, nodeIds);
    },
    [onToggle, setExpanded],
  );

  if (!data?.length) return null;

  const handleNavigationPopupClose = () => setNavigationPopup(null);

  const handleNavigationPopupChange: HvVerticalNavigationTreeProps["onChange"] =
    (event, selectedItem) => handleChange(event, selectedItem.id, selectedItem);

  const handleMouseLeave = () => {
    if (useIcons && !isOpen && !navigationPopup?.fixedMode) {
      setNavigationPopup(null);
    }
  };

  return (
    <nav
      id={id}
      className={cx(classes.root, className)}
      onMouseLeave={handleMouseLeave}
      {...others}
    >
      <HvVerticalNavigationTreeView
        className={classes.list}
        id={id ? `${id}-tree` : undefined}
        mode={mode}
        collapsible={collapsible}
        selected={selected}
        expanded={expanded}
        onChange={handleChange}
        onToggle={handleToggle}
        selectable
      >
        {useIcons && !isOpen && navigationPopup && (
          <NavigationPopupContainer
            anchorEl={navigationPopup.anchorEl}
            onClose={handleNavigationPopupClose}
            key={navigationPopup.uniqueKey}
          >
            <HvVerticalNavigationTree
              collapsible
              selected={selected}
              data={navigationPopup.data}
              onChange={handleNavigationPopupChange}
              onMouseLeave={() => {
                if (!navigationPopup.fixedMode) handleNavigationPopupClose();
              }}
            />
          </NavigationPopupContainer>
        )}
        {createListHierarchy(
          data,
          classes,
          labels,
          treeViewItemMouseEnterHandler,
        )}
      </HvVerticalNavigationTreeView>
    </nav>
  );
};
