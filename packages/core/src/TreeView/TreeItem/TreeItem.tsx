/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import Collapse from "@mui/material/Collapse";
import type { TransitionProps } from "@mui/material/transitions";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useForkRef } from "../../hooks/useForkRef";
import {
  DescendantProvider,
  useDescendant,
  type TreeItemDescendant,
} from "../internals/DescendantProvider";
import type { DefaultTreeViewPlugins } from "../internals/hooks/plugins";
import { useTreeViewContext } from "../internals/TreeViewProvider";
import { DefaultContent, type HvTreeContentClasses } from "./DefaultContent";
import { staticClasses, useClasses } from "./TreeItem.styles";

export { staticClasses as treeItemClasses };

export type HvTreeItemClasses = ExtractNames<typeof useClasses>;

export interface HvTreeContentProps extends React.HTMLAttributes<HTMLElement> {
  /** className applied to the root element. */
  className?: string;
  /** Override or extend the styles applied to the component. */
  classes?: HvTreeContentClasses;
  /** The tree node label. */
  label?: React.ReactNode;
  /** The id of the node. */
  nodeId: string;
  /** The icon to display next to the tree node's label. */
  icon?: React.ReactNode;
  /** The icon to display next to the tree node's label. Either an expansion or collapse icon. */
  expansionIcon?: React.ReactNode;
  /** The icon to display next to the tree node's label. Either a parent or end icon. */
  displayIcon?: React.ReactNode;
}

export interface HvTreeItemProps extends React.HTMLAttributes<HTMLElement> {
  /** The element id */
  id?: string;
  /** The id of the node. */
  nodeId: string;
  /** The tree node label. */
  label?: React.ReactNode;
  /** Override or extend the styles applied to the component. */
  classes?: HvTreeItemClasses;
  /** If `true`, the node is disabled. */
  disabled?: boolean;
  /** The icon to display next to the tree node's label. */
  icon?: React.ReactNode;
  /** The component used for the content node. */
  ContentComponent?: React.JSXElementConstructor<HvTreeContentProps>;
  /** Props applied to the content component */
  ContentProps?: HvTreeContentProps;
  /** The content of the component. */
  children?: React.ReactNode;
  /** className applied to the root element. */
  className?: string;
  /** The icon used to collapse the node. */
  collapseIcon?: React.ReactNode;
  /** The icon displayed next to an end node. */
  endIcon?: React.ReactNode;
  /** The icon used to expand the node. */
  expandIcon?: React.ReactNode;
  /** The component used for the transition. */
  TransitionComponent?: React.JSXElementConstructor<TransitionProps>;
  /** Props applied to the transition component */
  TransitionProps?: TransitionProps;
  /** Whether to disable the following default behavior: when the item is focused, the focus is placed on the tree root. @default `false` */
  disableTreeFocus?: boolean;
}

export const HvTreeItem = forwardRef<HTMLLIElement, HvTreeItemProps>(
  function HvTreeItem(props, ref) {
    const {
      id: idProp,
      nodeId,
      children,
      classes: classesProp,
      className,
      label,
      disabled: disabledProp,
      icon,
      endIcon,
      expandIcon,
      collapseIcon,
      ContentComponent: Component = DefaultContent,
      TransitionProps: transitionProps,
      ContentProps: contentProps,
      disableTreeFocus = false,
      ...others
    } = useDefaultProps("HvTreeItem", props);
    const { classes, cx } = useClasses(classesProp);

    const {
      instance,
      multiSelect,
      disabledItemsFocusable,
      treeId,
      icons: contextIcons,
    } = useTreeViewContext<DefaultTreeViewPlugins>();

    const id =
      idProp || (treeId && nodeId && `${treeId}-${nodeId}`) || undefined;

    const [treeItemElement, setTreeItemElement] =
      useState<HTMLLIElement | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(setTreeItemElement, ref);

    const descendant = useMemo<TreeItemDescendant>(
      () => ({ element: treeItemElement!, id: nodeId }),
      [nodeId, treeItemElement],
    );

    const { index, parentId, level } = useDescendant(descendant);

    const expandable = !!(Array.isArray(children) ? children.length : children);
    const expanded = instance ? instance.isNodeExpanded(nodeId) : false;
    const focused = instance ? instance.isNodeFocused(nodeId) : false;
    const selected = instance ? instance.isNodeSelected(nodeId) : false;
    const disabled = instance ? instance.isNodeDisabled(nodeId) : false;

    const expansionIcon = !expanded
      ? expandIcon || contextIcons.defaultExpandIcon
      : collapseIcon || contextIcons.defaultCollapseIcon;

    const displayIcon = expandable
      ? contextIcons.defaultParentIcon
      : endIcon || contextIcons.defaultEndIcon;

    useEffect(() => {
      // On the first render a node's index will be -1. We want to wait for the real index.
      if (instance && index !== -1) {
        instance.updateNode({
          id: nodeId,
          idAttribute: id,
          index,
          parentId,
          expandable,
          disabled: disabledProp,
        });

        return () => instance.removeNode(nodeId);
      }

      return undefined;
    }, [instance, parentId, index, nodeId, expandable, disabledProp, id]);

    useEffect(() => {
      if (instance && label) {
        return instance.mapFirstChar(
          nodeId,
          (contentRef.current?.textContent ?? "").slice(0, 1).toLowerCase(),
        );
      }
      return undefined;
    }, [instance, nodeId, label]);

    const handleFocus = (event: React.FocusEvent<HTMLLIElement>) => {
      // DOM focus stays on the tree which manages focus with aria-activedescendant
      if (event.target === event.currentTarget && !disableTreeFocus) {
        const rootElement: any =
          typeof event.target.getRootNode === "function"
            ? event.target.getRootNode()
            : event.target.ownerDocument || document;

        rootElement.getElementById(treeId).focus({ preventScroll: true });
      }

      const unfocusable = !disabledItemsFocusable && disabled;
      const canFocus =
        instance &&
        !focused &&
        !disabled &&
        !unfocusable &&
        event.currentTarget === event.target;

      if (canFocus) {
        instance.focusNode(event, nodeId);
      }
    };

    return (
      <li
        id={id}
        ref={handleRef}
        role="treeitem"
        aria-expanded={expandable ? expanded : undefined}
        aria-selected={(multiSelect && selected) || selected || undefined}
        aria-disabled={disabled || undefined}
        className={cx(classes.root, className)}
        // @ts-ignore
        onFocus={handleFocus}
        tabIndex={-1}
        {...others}
      >
        <Component
          ref={contentRef}
          nodeId={nodeId}
          classes={{
            root: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            focused: classes.focused,
            disabled: classes.disabled,
            label: classes.label,
            iconContainer: classes.iconContainer,
          }}
          label={label}
          icon={icon}
          expansionIcon={expandable && expansionIcon}
          displayIcon={displayIcon}
          {...contentProps}
        />
        {children && (
          <DescendantProvider id={nodeId} level={level + 1}>
            <Collapse
              component="ul"
              role="group"
              unmountOnExit
              className={classes.group}
              in={expanded}
              {...transitionProps}
            >
              {children}
            </Collapse>
          </DescendantProvider>
        )}
      </li>
    );
  },
);
