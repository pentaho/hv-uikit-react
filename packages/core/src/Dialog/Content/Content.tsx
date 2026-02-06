import { useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import MuiDialogContent, {
  DialogContentProps as MuiDialogContentProps,
} from "@mui/material/DialogContent";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTypography } from "../../Typography";
import { staticClasses, useClasses } from "./Content.styles";

export { staticClasses as dialogContentClasses };

export type HvDialogContentClasses = ExtractNames<typeof useClasses>;

export interface HvDialogContentProps
  extends Omit<MuiDialogContentProps, "classes"> {
  /** Content should be indented in relationship to the Dialog title. */
  indentContent?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvDialogContentClasses;
}

export const HvDialogContent = (props: HvDialogContentProps) => {
  const {
    classes: classesProp,
    className,
    children,
    indentContent,
    dividers,
    ...others
  } = useDefaultProps("HvDialogContent", props);

  const { classes, cx } = useClasses(classesProp);
  const [hasBorder, setHasBorder] = useState(false);

  const { ref: elRef } = useResizeDetector<HTMLDivElement>({
    refreshMode: "throttle",
    refreshRate: 100,
    handleWidth: false,
    disableRerender: true,
    onResize: ({ entry }) => {
      if (!entry) return;
      const hasOverflow = entry.target.scrollHeight > entry.target.clientHeight;
      setHasBorder(hasOverflow);
    },
  });

  return (
    <HvTypography
      ref={elRef}
      component={MuiDialogContent}
      dividers={dividers ?? hasBorder}
      className={cx(
        classes.root,
        { [classes.textContent]: !!indentContent },
        className,
      )}
      {...others}
    >
      {children}
    </HvTypography>
  );
};
