import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import { HvTypography } from "../../Typography";
import { staticClasses, useClasses } from "./Brand.styles";

export { staticClasses as headerBrandClasses };

export type HvHeaderBrandClasses = ExtractNames<typeof useClasses>;

export interface HvHeaderBrandProps extends HvBaseProps {
  logo?: React.ReactNode;
  name?: string;
  classes?: HvHeaderBrandClasses;
}

/**
 * Header component is used to render a header bar with logo and brand name, navigation and actions.
 */
export const HvHeaderBrand = forwardRef<
  React.ElementRef<"div">,
  HvHeaderBrandProps
>(function HvHeaderBrand(props, ref) {
  const {
    classes: classesProp,
    logo,
    name,
    className,
    ...others
  } = useDefaultProps("HvHeaderBrand", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <div ref={ref} className={cx(classes.root, className)} {...others}>
      {logo}
      {logo && name && <div className={classes.separator} />}
      {name && (
        <HvTypography className={classes.brandName} variant="label">
          {name}
        </HvTypography>
      )}
    </div>
  );
});
