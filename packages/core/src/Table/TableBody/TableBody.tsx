import {
  Children,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
} from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFocus } from "../../Focus";
import { useForkRef } from "../../hooks/useForkRef";
import type { HvBaseProps } from "../../types/generic";
import TableContext from "../TableContext";
import {
  TableSectionContext,
  type TableSectionContextValue,
} from "../TableSectionContext";
import { staticClasses, useClasses } from "./TableBody.styles";

export { staticClasses as tableBodyClasses };

export type HvTableBodyClasses = ExtractNames<typeof useClasses>;

export interface HvTableBodyProps extends HvBaseProps<
  HTMLTableSectionElement,
  "children"
> {
  /**
   * Content to be rendered
   */
  children: React.ReactNode;
  /**
   * The component used for the root node. Either a string to use a HTML element or a component.
   * Defaults to tbody.
   */
  component?: React.ElementType;
  /** Sets whether or not there should be arrow navigation between the table rows */
  withNavigation?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTableBodyClasses;
}

const tableSectionContext = {
  type: "body",
  filterClassName: "_trgrid",
} satisfies TableSectionContextValue;

const defaultComponent = "tbody";

/**
 * HvTableBody acts as a `tbody` element.
 * `HvTableCell` and `HvTableRow` elements in it inherit body-specific styles
 */
export const HvTableBody = forwardRef<HTMLElement, HvTableBodyProps>(
  function HvTableBody(props, externalRef) {
    const {
      classes: classesProp,
      className,
      component,
      children,
      withNavigation = false,
      ...others
    } = useDefaultProps("HvTableBody", props);
    const { classes, cx } = useClasses(classesProp);

    const tableContext = useContext(TableContext);

    const bodyRef = useRef(null);

    const handleRef = useForkRef(externalRef, bodyRef);

    const Component =
      component || tableContext?.components?.TBody || defaultComponent;

    return (
      <TableSectionContext.Provider value={tableSectionContext}>
        <Component
          className={cx(classes.root, className)}
          ref={handleRef}
          role={Component === defaultComponent ? null : "rowgroup"}
          {...others}
        >
          {withNavigation
            ? Children.map(children, (element) => {
                if (!isValidElement(element)) return undefined;
                return (
                  <HvFocus
                    id={`my-id-${element.key}`}
                    rootRef={bodyRef}
                    key={`row-${element.key}`}
                    strategy="grid"
                    filterClass={tableSectionContext.filterClassName}
                    navigationJump={1}
                    focusDisabled={false}
                    selected={element.props.selected}
                  >
                    {element}
                  </HvFocus>
                );
              })
            : children}
        </Component>
      </TableSectionContext.Provider>
    );
  },
);
