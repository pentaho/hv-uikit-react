import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Login.styles";

export { staticClasses as loginClasses };

export type HvLoginClasses = ExtractNames<typeof useClasses>;

export interface HvLoginProps extends HvBaseProps {
  /**
   *  The path for the background image.
   */
  background?: string;
  /**
   * Class names to be applied.
   */
  classes?: HvLoginClasses;
}

/**
 * Container layout for the login form.
 */
export const HvLogin = forwardRef<
  // no-indent
  React.ComponentRef<"div">,
  HvLoginProps
>(function HvLogin(props, ref) {
  const {
    className,
    classes: classesProp,
    children,
    background,
    ...others
  } = useDefaultProps("HvLogin", props);

  const { classes, cx } = useClasses(classesProp);

  return (
    <div
      ref={ref}
      className={cx(classes.root, className)}
      style={{
        backgroundImage: background && `url(${background})`,
      }}
      {...others}
    >
      <div className={classes.formContainer}>{children}</div>
    </div>
  );
});
