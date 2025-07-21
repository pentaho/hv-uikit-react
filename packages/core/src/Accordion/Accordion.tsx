import { forwardRef, useCallback, useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButtonBase } from "../ButtonBase";
import { useExpandable } from "../hooks/useExpandable";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
import { HvTypography, HvTypographyVariants } from "../Typography";
import { staticClasses, useClasses } from "./Accordion.styles";

export { staticClasses as accordionClasses };

export type HvAccordionClasses = ExtractNames<typeof useClasses>;

export interface HvAccordionProps
  extends HvBaseProps<HTMLDivElement, "onChange" | "children"> {
  /** Content to be rendered. */
  children: React.ReactNode;
  /** The accordion label button. */
  label?: React.ReactNode;
  /** The function that will be executed whenever the accordion toggles. It will receive the state of the accordion. */
  onChange?: (event: React.SyntheticEvent, value: boolean) => void;
  /** Whether the accordion is open or not. If this property is defined the accordion must be fully controlled. */
  expanded?: boolean;
  /** When uncontrolled, defines the initial expanded state. */
  defaultExpanded?: boolean;
  /** An object containing props to be passed onto container holding the accordion children. */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Heading level to apply to accordion button. If `undefined` the button won't have a header wrapper. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Whether the accordion is disabled. */
  disabled?: boolean;
  /** Typography variant for the label. */
  labelVariant?: HvTypographyVariants;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvAccordionClasses;
  /** Whether to disable the internal usage of `preventDefault` and `stopPropagation` when the `onChange` event is triggered. */
  disableEventHandling?: boolean; // TODO - remove in v6 as this should be the default behavior: `preventDefault` and `stopPropagation` shouldn't be triggered internally
}

/**
 * An accordion is a design element that expands in place to expose hidden information.
 */
export const HvAccordion = forwardRef<
  React.ComponentRef<"div">,
  HvAccordionProps
>(function HvAccordion(props, ref) {
  const {
    className,
    classes: classesProp,
    disabled = false,
    label,
    onChange,
    children,
    expanded,
    headingLevel,
    defaultExpanded = false,
    containerProps,
    labelVariant = "label",
    disableEventHandling,
    ...others
  } = useDefaultProps("HvAccordion", props);
  const { classes, cx } = useClasses(classesProp);

  const { isOpen, toggleOpen, buttonProps, regionProps } = useExpandable({
    expanded,
    disabled,
    defaultExpanded,
  });

  const handleClick = useCallback(
    (event: React.SyntheticEvent) => {
      if (!disabled) {
        onChange?.(event, isOpen);
        toggleOpen();
      }

      if (!disableEventHandling) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [disableEventHandling, disabled, isOpen, onChange, toggleOpen],
  );

  const accordionHeader = useMemo(() => {
    const accordionButton = (
      <HvTypography
        {...buttonProps}
        component={HvButtonBase}
        className={cx(classes.label, { [classes.disabled]: disabled })}
        disabled={disabled}
        onClick={handleClick}
        variant={labelVariant}
      >
        <HvIcon name="CaretDown" rotate={isOpen} size="xs" />
        {label}
      </HvTypography>
    );

    return headingLevel === undefined ? (
      accordionButton
    ) : (
      <HvTypography component={`h${headingLevel}`} variant={labelVariant}>
        {accordionButton}
      </HvTypography>
    );
  }, [
    cx,
    classes,
    handleClick,
    label,
    buttonProps,
    disabled,
    headingLevel,
    isOpen,
    labelVariant,
  ]);

  return (
    <div ref={ref} className={cx(classes.root, className)} {...others}>
      {accordionHeader}
      <div
        className={cx(classes.container, { [classes.hidden]: !isOpen })}
        hidden={!isOpen}
        {...regionProps}
        {...containerProps}
      >
        {children}
      </div>
    </div>
  );
});
