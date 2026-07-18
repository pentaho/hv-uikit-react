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
import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../../types/generic";
import { HvTypography } from "../../../Typography";
import { isKey } from "../../../utils/keyboardUtils";
import { Bar } from "../MenuBar/Bar";
import type { HvHeaderNavigationItemProp } from "../useSelectionPath";
import { FocusContext } from "../utils/FocusContext";
import { SelectionContext } from "../utils/SelectionContext";
import { staticClasses, useClasses } from "./MenuItem.styles";

export { staticClasses as headerMenuItemClasses };

export type HvHeaderMenuItemClasses = ExtractNames<typeof useClasses>;

export interface HvHeaderMenuItemProps extends HvBaseProps<
  HTMLDivElement,
  "onClick"
> {
  item: HvHeaderNavigationItemProp;
  type?: string;
  onClick?: (
    event: React.MouseEvent,
    selection: HvHeaderNavigationItemProp,
  ) => void;
  levels: number;
  currentLevel: number;
  classes?: HvHeaderMenuItemClasses;
}

// Traverse the tree of items and return the first href it finds
const traverseItem = (
  node: HvHeaderNavigationItemProp,
): { href?: string; target?: string } => {
  let href: string | undefined;
  let target: string | undefined;

  if (node?.href) {
    href = node?.href;
    target = node?.target;
  } else if (node?.data != null && node?.data?.length > 0) {
    let i = 0;
    while (href == null && i < node.data.length) {
      const childNavItem = traverseItem(node?.data[i]);
      if (childNavItem?.href != null) {
        href = childNavItem?.href;
        target = childNavItem?.target;
        break;
      }

      i += 1;
    }
  }

  return { href, target };
};

export const HvHeaderMenuItem = (props: HvHeaderMenuItemProps) => {
  const {
    id,
    item,
    type,
    onClick,
    levels,
    currentLevel,
    classes: classesProp,
    className,
  } = useDefaultProps("HvHeaderMenuItem", props);
  const { classes, cx } = useClasses(classesProp);

  const selectionPath = useContext(SelectionContext);

  const { dispatch } = useContext(FocusContext);

  const { data } = item;

  const hasSubLevel = data?.length;

  const isMenu = type === "menu";

  const isSelected = selectionPath?.[isMenu ? 1 : 0] === item.id;

  // true: if the item is part of the selection path but is not the current page the user is seeing, i.e has more sub levels
  // page: used when the selected item is actually the current page the user is seeing
  const isCurrent = isSelected ? (hasSubLevel ? true : "page") : undefined;

  const actionHandler = (event: any) => {
    if (
      event.type === "click" ||
      isKey(event, "Enter") ||
      isKey(event, "Space")
    ) {
      if (event.type === "click") {
        event.currentTarget.blur();
      }

      onClick?.(event, item);
    }
  };

  const handleFocus = (event: React.FocusEvent) => {
    dispatch?.({ type: "setItemFocused", itemFocused: event.currentTarget });
  };

  const label = (
    <HvTypography
      component="span"
      variant={isSelected ? "label" : "body"}
      data-text={item.label}
    >
      {item.label}
    </HvTypography>
  );

  let itemHref = item?.href;
  let itemTarget = item?.target;

  // apps should configure the href even on parent items without content
  // so the fallback logic is theirs, but if not we'll do our best to find a link
  if (item?.href == null) {
    const { href, target } = traverseItem(item);
    itemHref = href;
    itemTarget = target;
  }

  // TODO: change to "a" only in v6, as buttons aren't accessible links. Allow custom `ItemComponent` to be passed
  const ItemComponent = itemHref ? "a" : "div";
  // TODO: allow any custom props to be passed
  const itemProps = itemHref
    ? { href: itemHref, target: itemTarget, "aria-label": item.label }
    : { role: "button", tabIndex: 0 };

  return (
    <li
      id={id}
      className={cx(
        classes.root,
        {
          [classes.menu]: isMenu,
          [classes.menubar]: !isMenu,
          [classes.selected]: !!isSelected,
        },
        className,
      )}
    >
      <ItemComponent
        className={cx(classes.item, {
          [classes.link]: itemHref,
          [classes.button]: !itemHref,
        })}
        onFocus={handleFocus}
        onClick={actionHandler}
        onKeyDown={actionHandler}
        aria-current={isCurrent}
        {...itemProps}
      >
        {label}
      </ItemComponent>
      {/* Limits levels to no more than 2. More than that is not expected and not in DS. */}
      {hasSubLevel && currentLevel < levels && currentLevel < 2 && (
        <Bar data={data} type="menu">
          {data.map((itm) => (
            <HvHeaderMenuItem
              key={itm.id}
              item={itm}
              type="menu"
              onClick={onClick}
              levels={levels}
              currentLevel={currentLevel + 1}
            />
          ))}
        </Bar>
      )}
    </li>
  );
};
