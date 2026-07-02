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

  setOpen?: (open: boolean) => void;

  selected?: string;
  setSelected?: (id: string) => void;

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
