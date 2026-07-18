/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type SyntheticEvent,
} from "react";
import {
  HvTypography,
  setId,
  useControlled,
  useDefaultProps,
  useUniqueId,
  type ExtractNames,
  type HvBaseProps,
  type HvTypographyVariants,
} from "@hitachivantara/uikit-react-core";

import { staticClasses, useClasses } from "./Blade.styles";

export { staticClasses as bladeClasses };

export type HvBladeClasses = ExtractNames<typeof useClasses>;

export interface HvBladeProps extends HvBaseProps<
  HTMLDivElement,
  "onChange" | "children"
> {
  /**
   * The content that will be rendered within the blade.
   */
  children: React.ReactNode;

  /**
   * The content of the blade's button.
   *
   * If a render function is provided, it will be called with the expanded state as an argument.
   */
  label?: React.ReactNode | ((expanded: boolean) => React.ReactNode);
  /**
   * Typography variant for the blade's button label.
   */
  labelVariant?: HvTypographyVariants;
  /**
   * Heading Level to apply to blade button.
   *
   * If 'undefined', the button will not have a header wrapper.
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * Indicates whether the blade is expanded or not.
   *
   * When defined the expanded state becomes controlled.
   *
   * @default undefined
   */
  expanded?: boolean;
  /**
   * Specifies the initial expanded state of the blade when it is uncontrolled.
   */
  defaultExpanded?: boolean;

  /**
   * Callback function triggered when the blade's button is pressed.
   * It receives the event and the new expanded state as arguments.
   *
   * If the blade is uncontrolled, this new state will be effective.
   * If the blade is controlled, it is up to the parent component to manage this state.
   *
   * @param {SyntheticEvent} event The event source of the callback.
   * @param {boolean} value The new value.
   */
  onChange?: (event: React.SyntheticEvent, value: boolean) => void;

  /**
   * Specifies whether the blade is disabled. If true, the blade cannot be interacted with.
   */
  disabled?: boolean;

  /**
   * If true, the blade will take up the maximum width of the container when expanded.
   */
  fullWidth?: boolean;

  /**
   * Props to be passed to the button that toggles the blade's expanded state.
   * This can be used to further customize the appearance or behavior of the blade's button,
   * e.g. to set the aria-label attribute.
   */
  buttonProps?: HTMLAttributes<HTMLDivElement>;
  /**
   * Props to be passed to the container div that holds the blade's children.
   * This can be used to further customize the appearance or behavior of the blade's content area.
   */
  containerProps?: HTMLAttributes<HTMLDivElement>;
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvBladeClasses;
}

/**
 * A blade is a design element that expands horizontally to reveal information, similar to an accordion.
 *
 * It is usually stacked horizontally with other blades and works best when used within a flex container.
 * The `HvBlades` component is recommended for this purpose, as it also provides better management of the
 * blades' expanded state.
 */
export const HvBlade = (props: HvBladeProps) => {
  const {
    id: idProp,
    className,
    classes: classesProp,
    expanded,
    defaultExpanded = false,
    label,
    labelVariant = "label",
    headingLevel,
    onChange,
    disabled = false,
    children,
    fullWidth,
    buttonProps,
    containerProps,
    ...others
  } = useDefaultProps("HvBlade", props);

  const { classes, cx } = useClasses(classesProp);

  const [isExpanded, setIsExpanded] = useControlled(
    expanded,
    Boolean(defaultExpanded),
  );

  const handleAction = useCallback(
    (event: SyntheticEvent) => {
      if (!disabled) {
        onChange?.(event, !isExpanded);

        // This will only run if uncontrolled
        setIsExpanded(!isExpanded);

        return true;
      }
      return false;
    },
    [disabled, onChange, isExpanded, setIsExpanded],
  );

  const handleClick = useCallback(
    (event: SyntheticEvent) => {
      handleAction(event);
      event.preventDefault();
      event.stopPropagation();
    },
    [handleAction],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      let isEventHandled = false;
      const { key } = event;

      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.currentTarget !== event.target
      ) {
        return;
      }
      switch (key) {
        case "Enter":
        case " ":
          isEventHandled = handleAction(event);
          break;
        default:
          return;
      }

      if (isEventHandled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [handleAction],
  );

  const id = useUniqueId(idProp);
  const bladeHeaderId = setId(id, "button");
  const bladeContainerId = setId(id, "container");
  const bladeHeader = useMemo(() => {
    const buttonLabel = typeof label === "function" ? label(isExpanded) : label;

    const bladeButton = (
      <HvTypography
        id={bladeHeaderId}
        component="div"
        // eslint-disable-next-line prefer-tag-over-role
        role="button"
        className={cx(classes.button, {
          [classes.textOnlyLabel]: typeof buttonLabel === "string",
          [classes.disabled]: disabled,
        })}
        style={{ flexShrink: headingLevel === undefined ? 0 : undefined }}
        disabled={disabled}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        variant={labelVariant}
        aria-expanded={isExpanded}
        aria-controls={bladeContainerId}
        {...buttonProps}
      >
        {buttonLabel}
      </HvTypography>
    );
    return headingLevel === undefined ? (
      bladeButton
    ) : (
      <HvTypography
        component={`h${headingLevel}`}
        variant={labelVariant}
        className={classes.heading}
        style={{ flexShrink: 0 }}
      >
        {bladeButton}
      </HvTypography>
    );
  }, [
    bladeContainerId,
    bladeHeaderId,
    buttonProps,
    classes.button,
    classes.disabled,
    classes.heading,
    classes.textOnlyLabel,
    cx,
    disabled,
    handleClick,
    handleKeyDown,
    headingLevel,
    isExpanded,
    label,
    labelVariant,
  ]);

  const bladeRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!bladeRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      setMaxWidth(entries[0].target.clientWidth);
    });
    resizeObserver.observe(
      // using the blade's container as reference max-width is more stable
      bladeRef.current.parentElement ?? bladeRef.current,
    );
    return () => {
      resizeObserver.disconnect();
    };
  }, [isExpanded]);

  const { style: containerStyle, ...otherContainerProps } =
    containerProps || {};

  return (
    <div
      ref={bladeRef}
      id={idProp}
      className={cx(classes.root, className, {
        [classes.fullWidth]: fullWidth,
        [classes.expanded]: isExpanded,
      })}
      {...others}
    >
      {bladeHeader}
      <div
        id={bladeContainerId}
        role="region"
        aria-labelledby={bladeHeaderId}
        className={classes.container}
        hidden={!isExpanded}
        style={{
          ...containerStyle,
          maxWidth: isExpanded ? maxWidth : 0,
        }}
        {...otherContainerProps}
      >
        {children}
      </div>
    </div>
  );
};
