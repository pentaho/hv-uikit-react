import { forwardRef, isValidElement } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvDropDownMenuProps } from "../DropDownMenu";
import { HvIconButton } from "../IconButton";
import { SvgBase } from "../icons";
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
  /** Home breadcrumb element. If passed, it will be displayed as the first breadcrumb item as a Home icon */
  home?: HvBreadCrumbPathElement;
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

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <SvgBase viewBox="0 0 256 256" width="16" height="16" {...props}>
    <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" />
  </SvgBase>
);

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
    home,
    maxVisible,
    url,
    onClick,
    component,
    dropDownMenuProps,
    separator,
    ...others
  } = useDefaultProps("HvBreadCrumb", props);

  const { classes, cx } = useClasses(classesProp);

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
        {home && (
          <HvPathElement
            classes={{
              centerContainer: classes.centerContainer,
              separatorContainer: classes.separatorContainer,
            }}
            separator={separator}
          >
            <HvIconButton
              title={home.label}
              component={component || "a"}
              href={home.path}
              onClick={(event: React.MouseEvent<HTMLElement>) => {
                event.preventDefault();
                onClick?.(event, home);
              }}
            >
              <HomeIcon />
            </HvIconButton>
          </HvPathElement>
        )}
        {listPath.map((elem, index) => {
          const key = `key_${index}`;
          const isLast = index === breadcrumbPath.length - 1;

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
