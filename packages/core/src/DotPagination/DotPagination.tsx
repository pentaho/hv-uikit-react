import { cloneElement } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseRadio } from "../BaseRadio";
import { HvRadioGroup, HvRadioGroupProps } from "../RadioGroup";
import { range } from "../utils/helpers";
import { staticClasses, useClasses } from "./DotPagination.styles";

const currentStep = (
  <div style={{ fontSize: 8 }}>
    <div />
  </div>
);

const otherStep = (
  <div style={{ fontSize: 4 }}>
    <div />
  </div>
);

export { staticClasses as dotPaginationClasses };

export type HvDotPaginationClasses = ExtractNames<typeof useClasses>;

export interface HvDotPaginationProps
  extends Omit<HvRadioGroupProps, "classes"> {
  /**
   * Icon to override the default one used for the unselected state.
   *
   * The default icon is `OtherStep`.
   */
  unselectedIcon?: React.ReactElement<any>;
  /**
   * Icon to override the default one used for the selected state.
   *
   * The default icon is `CurrentStep`.
   */
  selectedIcon?: React.ReactElement<any>;
  /**
   *  The number of pages the component has.
   */
  pages?: number;
  /**
   * The currently selected page.
   */
  page?: number;
  /**
   * The callback fired when the page value changes.
   */
  onPageChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    page: number,
  ) => void;
  /**
   * The callback fired to get the page aria label.
   */
  getItemAriaLabel?: (page: number) => string;
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvDotPaginationClasses;
}

const getSelectorIcons = (
  radioIcon?: React.ReactElement<any>,
  radioCheckedIcon?: React.ReactElement<any>,
  classes?: HvDotPaginationClasses,
) => {
  return {
    radio: cloneElement(radioIcon || otherStep, {
      className: classes?.icon,
    }),
    radioChecked: cloneElement(radioCheckedIcon || currentStep, {
      className: classes?.icon,
    }),
  };
};

/**
 * Pagination is the process of dividing a document into discrete pages. It relates to how users interact with structured content on a website or application.
 * This component uses Radio Buttons to represent each page.
 */
export const HvDotPagination = (props: HvDotPaginationProps) => {
  const {
    className,
    classes: classesProp,
    unselectedIcon,
    selectedIcon,
    pages = 1,
    page = 0,
    onPageChange,
    getItemAriaLabel,
    ...others
  } = useDefaultProps("HvDotPagination", props);

  const { classes, cx } = useClasses(classesProp);

  const icons = getSelectorIcons(unselectedIcon, selectedIcon, classes);

  return (
    <HvRadioGroup
      className={cx(classes.root, className)}
      classes={{
        horizontal: classes.horizontal,
      }}
      orientation="horizontal"
      {...others}
    >
      {range(pages).map((i) => (
        <HvBaseRadio
          className={classes.radio}
          key={i}
          value={i}
          checked={page === i}
          onChange={(event) => onPageChange?.(event, i)}
          icon={icons.radio}
          checkedIcon={icons.radioChecked}
          inputProps={{ "aria-label": getItemAriaLabel?.(i) }}
        />
      ))}
    </HvRadioGroup>
  );
};
