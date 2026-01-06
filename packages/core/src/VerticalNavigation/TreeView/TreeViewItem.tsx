import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvAvatar } from "../../Avatar";
import { useForkRef } from "../../hooks/useForkRef";
import { HvIcon } from "../../icons";
import { HvOverflowTooltip } from "../../OverflowTooltip";
import { HvTooltip } from "../../Tooltip";
import {
  DescendantProvider,
  useDescendant,
} from "../../TreeView/internals/DescendantProvider";
import { HvTypography } from "../../Typography";
import { VerticalNavigationContext } from "../VerticalNavigationContext";
import {
  TreeViewControlContext,
  TreeViewStateContext,
} from "./TreeViewContext";
import { staticClasses, useClasses } from "./TreeViewItem.styles";

export { staticClasses as treeViewItemClasses };

export type HvVerticalNavigationTreeViewItemClasses = ExtractNames<
  typeof useClasses
>;

export interface HvVerticalNavigationTreeViewItemProps {
  /**
   * Id to be applied to the root node.
   */
  id?: string;
  /**
   * Class names to be applied.
   */
  className?: string;
  /**
   * A Jss Object used to override or extend the styles applied to the Radio button.
   */
  classes?: HvVerticalNavigationTreeViewItemClasses;
  /**
   * Is the node disabled.
   */
  disabled?: boolean;
  /**
   * Can the node be selected.
   */
  selectable?: boolean;
  /**
   * The id of the node.
   */
  nodeId?: string;
  /**
   * The icon to display next to the node's label.
   */
  icon?: React.ReactNode;
  /**
   * The item label.
   */
  label?: React.ReactNode;
  /**
   * The url for the link.
   */
  href?: string;
  /**
   * The behavior when opening a link.
   */
  target?: string;
  /**
   * The node payload.
   */
  payload?: any;
  /**
   * @ignore
   */
  onClick?: any;
  /**
   * @ignore
   */
  onMouseDown?: any;
  /**
   * @ignore
   */
  onFocus?: any;
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * @ignore
   */
  onMouseEnter?: any;
  /**
   * Disables the appearence of a tooltip on hovering an element ( Only applicable when the in collapsed mode)
   */
  disableTooltip?: boolean;
}

const preventSelection = (event: any, disabled: any) => {
  if (event.shiftKey || event.ctrlKey || event.metaKey || disabled) {
    // Prevent text selection
    event.preventDefault();
  }
};

export const HvVerticalNavigationTreeViewItem = forwardRef(
  function HvVerticalNavigationTreeViewItem(
    props: HvVerticalNavigationTreeViewItemProps,
    ref,
  ) {
    const {
      id: idProp,
      className,
      classes: classesProp,

      disabled: disabledProp = false,

      selectable: selectableProp,

      nodeId,
      icon = null,
      label,
      href,
      target,
      payload,

      onClick,
      onMouseDown,
      onFocus,

      children,

      disableTooltip,

      ...others
    } = useDefaultProps("HvVerticalNavigationTreeViewItem", props);

    const { classes, cx } = useClasses(classesProp);

    const treeViewControlContext = useContext(TreeViewControlContext);
    const { isExpanded, isSelected, isFocused, isDisabled, isChildSelected } =
      useContext(TreeViewStateContext);

    const {
      treeId,
      mode,
      collapsible,
      toggleExpansion,
      multiSelect,
      selectNode,
      selectRange,
      disabledItemsFocusable,
      registerNode,
      unregisterNode,
      mapFirstChar,
      unMapFirstChar,
      focus,
    } = treeViewControlContext;

    const treeviewMode = mode === "treeview";

    let id: string | null = null;
    const groupId = useId();

    if (idProp != null) {
      id = idProp;
    } else if (treeId && nodeId) {
      id = `${treeId}-${nodeId}`;
    }

    const [treeitemElement, setTreeitemElement] = useState<HTMLLIElement>();
    const contentRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(setTreeitemElement, ref);

    const descendant = useMemo(
      () => ({
        element: treeitemElement!,
        id: nodeId!,
      }),
      [nodeId, treeitemElement],
    );

    const { isOpen, useIcons, hasAnyChildWithData } = useContext(
      VerticalNavigationContext,
    );

    const { index, parentId, level } = useDescendant(descendant);

    const expandable = collapsible && Array.isArray(children);
    const expanded = isExpanded ? isExpanded(nodeId) : false;
    const focused = isFocused ? isFocused(nodeId) : false;
    const selected = isSelected ? isSelected(nodeId) : false;
    const disabled = isDisabled ? isDisabled(nodeId) : false;

    const selectable =
      selectableProp != null
        ? selectableProp
        : !collapsible || !expandable || !isOpen;

    useEffect(() => {
      // On the first render a node's index will be -1. We want to wait for the real index.
      if (registerNode && unregisterNode && index !== -1) {
        registerNode({
          id: nodeId,
          idAttribute: id,
          index,
          parentId,
          selectable,
          expandable,
          disabled: disabledProp,
          onFocus,
          payload,
        });

        return () => {
          unregisterNode(nodeId);
        };
      }

      return undefined;
    }, [
      registerNode,
      unregisterNode,
      parentId,
      index,
      nodeId,
      expandable,
      disabledProp,
      id,
      selectable,
      onFocus,
      payload,
    ]);

    useEffect(() => {
      if (
        mapFirstChar &&
        unMapFirstChar &&
        label &&
        contentRef.current?.textContent
      ) {
        mapFirstChar(
          nodeId,
          contentRef.current?.textContent.slice(0, 1).toLowerCase(),
        );

        return () => {
          unMapFirstChar(nodeId);
        };
      }
      return undefined;
    }, [mapFirstChar, unMapFirstChar, nodeId, label]);

    let ariaSelected;
    if (multiSelect) {
      ariaSelected = selected;
    } else if (selected) {
      /* single-selection trees unset aria-selected on un-selected items.
       *
       * If the tree does not support multiple selection, aria-selected
       * is set to true for the selected node and it is not present on any other node in the tree.
       * Source: https://www.w3.org/TR/wai-aria-practices/#TreeView
       */
      ariaSelected = true;
    }

    const handleFocus = useCallback(
      (event: any) => {
        // DOM focus stays on the tree which manages focus with aria-activedescendant
        if (event.target === event.currentTarget) {
          (event.target.ownerDocument || document)
            .getElementById(treeId)
            .focus({ preventScroll: true });
        }

        const unfocusable = !disabledItemsFocusable && disabled;
        if (
          !focused &&
          event.currentTarget === event.target &&
          !unfocusable &&
          focus
        ) {
          focus(event, nodeId);
        }
      },
      [disabled, disabledItemsFocusable, focus, focused, nodeId, treeId],
    );

    const handleExpansion = useCallback(
      (event: any) => {
        if (!disabled) {
          if (treeviewMode && !focused && focus) {
            focus(event, nodeId);
          }

          const multiple =
            multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

          // If already expanded and trying to toggle selection don't close
          if (
            expandable &&
            isOpen &&
            !(multiple && isExpanded && isExpanded(nodeId))
          ) {
            if (toggleExpansion) toggleExpansion(event, nodeId);
          }
        }
      },
      [
        disabled,
        expandable,
        focus,
        focused,
        isExpanded,
        multiSelect,
        nodeId,
        toggleExpansion,
        treeviewMode,
        isOpen,
      ],
    );

    const handleSelection = useCallback(
      (event: any) => {
        if (selectable && !disabled) {
          if (treeviewMode && !focused && focus) {
            focus(event, nodeId);
          }

          const multiple =
            multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

          if (multiple) {
            if (event.shiftKey) {
              if (selectRange) return selectRange(event, { end: nodeId });
            } else if (selectNode) return selectNode(event, nodeId, true);
          } else if (selectNode) return selectNode(event, nodeId);
        } else {
          return false;
        }
      },
      [
        disabled,
        focus,
        focused,
        multiSelect,
        nodeId,
        selectNode,
        selectRange,
        selectable,
        treeviewMode,
      ],
    );

    const handleMouseDown = useCallback(
      (event: any) => {
        preventSelection(event, disabled);

        if (onMouseDown) {
          onMouseDown(event);
        }
      },
      [disabled, onMouseDown],
    );

    const handleClick = useCallback(
      (event: any) => {
        if (!disabled) {
          if (expandable && isOpen) {
            handleExpansion(event);
          }

          if (selectable) {
            handleSelection(event);
          }
        }

        if (onClick) {
          onClick(event);
        }
      },
      [
        disabled,
        expandable,
        handleExpansion,
        handleSelection,
        onClick,
        selectable,
        isOpen,
      ],
    );

    const handleKeyDown = useCallback(
      (event: any) => {
        let isEventHandled = false;
        const { key } = event;

        if (
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.currentTarget !== event.target
        ) {
          return;
        }
        if (contentRef.current === event.currentTarget) {
          if (key === "Enter" || key === " ") {
            if (expandable && isOpen) {
              isEventHandled = handleExpansion(event) as unknown as boolean;
            }

            if (selectable) {
              isEventHandled = handleSelection(event) as boolean;
            }
          }

          if (isEventHandled) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
      },
      [expandable, handleExpansion, handleSelection, selectable, isOpen],
    );

    const renderedContent = useMemo(() => {
      const buttonLinkProps = {
        href,
        target,
      };

      const hasChildren = !!children;
      const showTooltip = !hasChildren && !isOpen && !disableTooltip;

      const isLink = href !== undefined && !disabled;

      return (
        <HvTooltip placement="right" title={showTooltip && label}>
          <HvTypography
            component={isLink ? "a" : "div"}
            {...(isLink ? buttonLinkProps : null)}
            ref={contentRef}
            classes={{
              root: cx(classes.content, {
                [classes.link]: isLink,
                [classes.minimized]: !isOpen,
              }),
            }}
            variant="body"
            disabled={disabled}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            style={{
              paddingLeft:
                (useIcons || !isOpen ? 0 : 10) +
                level * (collapsible ? 16 : 10),
            }}
            role={isLink ? undefined : "button"}
            {...(treeviewMode
              ? {
                  tabIndex: -1,
                  onFocus: handleFocus,
                }
              : {
                  tabIndex: selectable || expandable ? 0 : -1,
                  onKeyDown: handleKeyDown,
                  "aria-current":
                    (selectable && selected) ||
                    (!isOpen && isChildSelected?.(nodeId))
                      ? href
                        ? "page"
                        : true
                      : undefined,
                  "aria-expanded": expandable ? expanded : undefined,
                  "aria-controls": isOpen && expandable ? groupId : undefined,
                  "aria-label": payload?.label,
                })}
          >
            <div
              className={classes.icon}
              style={mergeStyles(undefined, {
                "--icon-margin-left": hasAnyChildWithData ? "auto" : "unset",
              })}
            >
              {!icon && useIcons ? (
                <HvAvatar
                  variant="square"
                  size="xs"
                  backgroundColor="textSubtle"
                >
                  {payload?.label?.slice(0, 1)}
                </HvAvatar>
              ) : (
                useIcons && icon
              )}
              {hasChildren && !isOpen ? (
                <HvIcon name="Forwards" size="xs" compact />
              ) : (
                hasAnyChildWithData && !isOpen && <div />
              )}
            </div>

            {isOpen && (
              <div
                className={cx(classes.label, {
                  [classes.labelIcon]: useIcons,
                  [classes.labelExpandable]: !!expandable,
                })}
              >
                <HvOverflowTooltip data={label} />
              </div>
            )}

            {isOpen && expandable && (
              <HvIcon name="CaretDown" size="xs" rotate={expanded} />
            )}
          </HvTypography>
        </HvTooltip>
      );
    }, [
      href,
      target,
      children,
      isOpen,
      disableTooltip,
      disabled,
      label,
      groupId,
      cx,
      classes.content,
      classes.link,
      classes.minimized,
      classes.icon,
      classes.label,
      classes.labelIcon,
      classes.labelExpandable,
      handleClick,
      handleMouseDown,
      useIcons,
      level,
      collapsible,
      treeviewMode,
      handleFocus,
      selectable,
      expandable,
      handleKeyDown,
      selected,
      isChildSelected,
      nodeId,
      expanded,
      payload?.label,
      icon,
      hasAnyChildWithData,
    ]);

    const renderedChildren = useMemo(
      () =>
        children && (
          <ul
            id={groupId}
            className={classes.group}
            role={treeviewMode ? "group" : undefined}
          >
            {children}
          </ul>
        ),
      [children, classes?.group, groupId, treeviewMode],
    );

    return (
      <li
        ref={handleRef}
        id={id ?? undefined}
        className={cx(
          classes.node,
          {
            [classes.expandable]: expandable,
            [classes.collapsed]: expandable && !expanded,
            [classes.expanded]: expandable && expanded,
            [classes.selectable]: selectable && !disabled,
            [classes.unselectable]: !disabled && !selectable,
            [classes.selected]:
              (!disabled && selectable && selected) ||
              (!isOpen &&
                useIcons &&
                isChildSelected &&
                isChildSelected(nodeId)),
            [classes.unselected]: !disabled && selectable && !selected,
            [classes.focused]: focused,
            [classes.hide]: !isOpen && !useIcons,
            [classes.disabled]: disabled,
          },
          className,
        )}
        data-hasicon={icon != null ? true : undefined}
        {...(mode === "treeview" && {
          role: "treeitem",
          "aria-selected": ariaSelected,
          "aria-expanded": expandable ? expanded : undefined,
          "aria-disabled": disabled ? true : undefined,
        })}
        {...others}
      >
        {renderedContent}
        {isOpen && (
          <DescendantProvider id={nodeId} level={level + 1}>
            {renderedChildren}
          </DescendantProvider>
        )}
      </li>
    );
  },
);
