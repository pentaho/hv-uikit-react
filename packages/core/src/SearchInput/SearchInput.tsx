import { forwardRef } from "react";
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { HvAdornment } from "../FormElement";
import { HvIcon } from "../icons";
import { HvInput, type HvInputProps } from "../Input";
import { useClasses } from "./SearchInput.styles";

export interface HvSearchInputProps extends HvInputProps<HTMLInputElement> {}

/**
 * A Search Input allows users to enter and submit a search term.
 *
 * @extends HvInput
 */
export const HvSearchInput = forwardRef<
  React.ComponentRef<"input">,
  HvSearchInputProps
>(function HvSearchInput(props, ref) {
  const { classes: classesProp, ...others } = useDefaultProps(
    "HvSearchInput",
    props,
  );

  const { classes } = useClasses(classesProp);

  return (
    <HvInput
      ref={ref}
      type="search"
      disableSearchButton
      startAdornment={<HvAdornment icon={<HvIcon compact name="Search" />} />}
      classes={classes}
      {...others}
    />
  );
});
