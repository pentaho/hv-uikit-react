import { forwardRef, isValidElement } from "react";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvDropDownMenuProps } from "../DropDownMenu";
import { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import { staticClasses, useClasses } from "./BreadCrumb.styles";
import { HvBreadCrumbPage } from "./Page";
import { HvPathElement } from "./PathElement";
import { HvBreadCrumbPathElement } from "./types";
import { pathWithSubMenu, removeExtension } from "./utils";

export { staticClasses as breadCrumbClasses };

export type HvBreadCrumbClasses = ExtractNames<typeof useClasses>;

export interface HvBreadCrumbProps
  extends HvBaseProps<HTMLDivElement, "onClick"> {
  /** List of breadcrumb. */
  listRoute?: HvBreadCrumbPathElement[];
  /** URL to build the breadcrumb. */
  url?: string;
  /** Number of pages visible. */
  maxVisible?: number;
  /** The component used for the link node. Either a string to use a DOM element or a component. */
  component?: React.ElementType;
  /** Function passed to the component. If defined the component prop is used as the link node. */
  onClick?: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  /** Props passed down to the DropDownMenu sub-menu component. */
  dropDownMenuProps?: Partial<HvDropDownMenuProps>;
  /** Separator element between breadcrumb items. */
  separator?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBreadCrumbClasses;
}

/**
 * A breadcrumb is a graphical control element frequently used as a navigational aid.
 */
export const HvBreadCrumb = forwardRef<
  React.ComponentRef<"nav">,
  HvBreadCrumbProps
>(function HvBreadCrumb(props, ref) {
  const {
    classes: classesProp,
    className,
    id,
    listRoute = [],
    maxVisible,
    url,
    onClick,
    component,
    dropDownMenuProps,
    separator,
    ...others
  } = useDefaultProps("HvBreadCrumb", props);

  const { classes, cx } = useClasses(classesProp);
  const { activeTheme } = useTheme();

  const maxVisibleElem = maxVisible && maxVisible < 2 ? 2 : maxVisible;
  let listPath = listRoute.slice();

  // build the listPath object list
  if (url != null) {
    // get URL origin
    const baseUrl = url.match(/^.*\/\/[^/]+/) ?? "";

    // get URL pathname
    const pathNames = url
      .replace(/^.*\/\/[^/]+/, "")
      .split("/")
      .filter(Boolean);

    listPath = pathNames.map((elem, index) => ({
      label: decodeURI(elem),
      path: `${baseUrl}/${pathNames.slice(0, index + 1).join("/")}`,
    }));
  }

  const breadcrumbPath =
    maxVisibleElem && listPath.length > maxVisibleElem
      ? pathWithSubMenu(
          id,
          listPath,
          maxVisibleElem,
          onClick,
          dropDownMenuProps,
        )
      : listPath;

  return (
    <nav ref={ref} id={id} className={cx(classes.root, className)} {...others}>
      <ol className={classes.orderedList}>
        {listPath.map((elem, index) => {
          const key = `key_${index}`;
          const isLast = index === breadcrumbPath.length - 1;
          const isFirst = index === 0;

          return (
            <HvPathElement
              classes={{
                centerContainer: classes.centerContainer,
                separatorContainer: classes.separatorContainer,
              }}
              key={key}
              last={isLast}
              separator={separator}
            >
              {(isValidElement(elem) && elem) ||
                (isLast && (
                  <HvTypography
                    className={classes.currentPage}
                    variant="caption1"
                  >
                    {removeExtension(elem.label)}
                  </HvTypography>
                )) || (
                  <HvBreadCrumbPage
                    elem={elem}
                    showHome={isFirst && activeTheme?.name === "pentahoPlus"}
                    classes={{
                      a: classes.a,
                      link: classes.link,
                    }}
                    component={component}
                    onClick={onClick}
                  />
                )}
            </HvPathElement>
          );
        })}
      </ol>
    </nav>
  );
});
