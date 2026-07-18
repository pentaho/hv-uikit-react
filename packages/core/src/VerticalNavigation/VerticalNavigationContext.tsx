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
import { createContext } from "react";

export type NavigationData<T extends React.ElementType = "a"> =
  React.ComponentProps<T> &
    Record<string, any> & {
      /** The id to be applied to the root element. */
      id: string;
      /** The label to be rendered on the menu item. */
      label: string;
      /** The icon to be rendered. */
      icon?: React.ReactNode;
      /** The Data children subset. */
      data?: NavigationData<T>[];
      /** Whether the item is disabled and not interactive. */
      disabled?: boolean;
      /** Whether the item has a selected state. */
      selectable?: boolean;
    };

interface VerticalNavigationContextValue {
  isOpen: boolean;
  useIcons: boolean;
  slider?: boolean;
  headerTitle?: string;

  parentItem?: any;
  setParentItem?: React.Dispatch<React.SetStateAction<any>>;
  withParentData?: any;
  navigateToChildHandler?: (event: any, item: any) => void;
  navigateToParentHandler?: () => void;

  parentData?: NavigationData[];
  setParentData?: React.Dispatch<React.SetStateAction<any>>;
  parentSelected?: any;
  setParentSelected?: React.Dispatch<React.SetStateAction<any>>;

  hasAnyChildWithData?: boolean;
}

const VerticalNavigationContext = createContext<VerticalNavigationContextValue>(
  {
    isOpen: true,
    useIcons: false,
    slider: false,
  },
);

export { VerticalNavigationContext };
