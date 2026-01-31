import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIconButton } from "../../IconButton";
import { SvgBase } from "../../icons";
import { HvOverflowTooltip } from "../../OverflowTooltip";
import { HvTypography } from "../../Typography";
import { HvBreadCrumbPathElement } from "../types";
import { staticClasses, useClasses } from "./Page.styles";

export { staticClasses as breadCrumbPageClasses };

export type HvBreadCrumbPageClasses = ExtractNames<typeof useClasses>;

export interface HvBreadCrumbPageProps {
  component?: React.ElementType;
  onClick?: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  elem: HvBreadCrumbPathElement;
  showHome?: boolean;
  classes?: HvBreadCrumbPageClasses;
}

const HomeIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <SvgBase viewBox="0 0 256 256" width="16" height="16" {...props}>
    <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V160h32v56a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H160V152a8,8,0,0,0-8-8H104a8,8,0,0,0-8,8v56H48V120l80-80,80,80Z" />
  </SvgBase>
);

export const HvBreadCrumbPage = (props: HvBreadCrumbPageProps) => {
  const {
    component,
    onClick,
    elem,
    showHome,
    classes: classesProp,
  } = useDefaultProps("HvBreadCrumbPage", props);

  const { classes, cx } = useClasses(classesProp);

  const { label, path, ...others } = elem;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onClick?.(event, elem);
  };

  return showHome ? (
    <HvIconButton
      title={elem.label}
      component={component || "a"}
      href={elem.path}
      onClick={onClick && handleClick}
    >
      <HomeIcon />
    </HvIconButton>
  ) : (
    <HvTypography
      noWrap
      variant="captionLabel"
      component={component || "a"}
      href={elem.path}
      onClick={onClick && handleClick}
      className={cx(classes.link, classes.label, classes.a)}
      {...others}
    >
      <HvOverflowTooltip data={elem.label} />
    </HvTypography>
  );
};
