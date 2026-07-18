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
import { forwardRef } from "react";
import {
  createClasses,
  useCss,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useHvTreeItem } from "./useHvTreeItem";

export const { useClasses } = createClasses("HvTreeContent", {
  root: {},
  expanded: {},
  selected: {},
  focused: {},
  disabled: {},
  iconContainer: {},
  label: {},
});

export type HvTreeContentClasses = ExtractNames<typeof useClasses>;

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

/**
 * Internal default TreeItem `component`.
 * Use this as a basis to create a custom component.
 */
export const DefaultContent = forwardRef<HTMLDivElement, HvTreeContentProps>(
  function DefaultContent(props, ref) {
    const {
      classes: classesProp,
      className,
      displayIcon,
      expansionIcon,
      icon: iconProp,
      label,
      nodeId,
      onClick,
      onMouseDown,
      ...others
    } = props;
    const { classes } = useClasses(classesProp);

    const { cx } = useCss();

    const {
      disabled,
      expanded,
      selected,
      focused,
      handleExpansion,
      handleSelection,
      preventSelection,
    } = useHvTreeItem(nodeId);

    const icon = iconProp ?? expansionIcon ?? displayIcon;

    return (
      /* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions -- Key event is handled by the TreeView */
      <div
        {...others}
        className={cx(className, classes.root, {
          [classes.expanded]: expanded,
          [classes.selected]: selected,
          [classes.focused]: focused,
          [classes.disabled]: disabled,
        })}
        onClick={(event) => {
          handleExpansion(event);
          handleSelection(event);
          onClick?.(event);
        }}
        onMouseDown={(event) => {
          preventSelection(event);
          onMouseDown?.(event);
        }}
        ref={ref}
      >
        <div className={classes.iconContainer}>{icon}</div>
        <div className={classes.label}>{label}</div>
      </div>
    );
  },
);
