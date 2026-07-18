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
  Children,
  cloneElement,
  useCallback,
  useMemo,
  type SyntheticEvent,
} from "react";
import {
  useControlled,
  useDefaultProps,
  type ExtractNames,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";

import { staticClasses, useClasses } from "./Blades.styles";

export { staticClasses as bladesClasses };

export type HvBladesClasses = ExtractNames<typeof useClasses>;

export interface HvBladesProps extends HvBaseProps<
  HTMLDivElement,
  "onChange" | "children"
> {
  /**
   * Array of indices representing the expanded state of each blade.
   *
   * When defined, the expanded state of the blades becomes controlled.
   */
  expanded?: number[];
  /**
   * Initial expanded state of the blades when in an uncontrolled state.
   *
   * It's an array of indices representing the blades that should be initially expanded.
   */
  defaultExpanded?: number[];

  /**
   * If true, ensures that only one blade can be expanded at a time.
   */
  atMostOneExpanded?: boolean;
  /**
   * If true, ensures that at least one blade is always expanded.
   */
  atLeastOneExpanded?: boolean;

  /**
   * If true, the blades will take up the full width of the container by default.
   */
  fullWidthBlades?: boolean;

  /**
   * Callback function triggered when the expanded state of any blade changes.
   * It receives the event and the new array of expanded indices as arguments.
   *
   * If uncontrolled, this new state will be effective.
   * If controlled, it is up to the parent component to manage this state.
   *
   * @param {SyntheticEvent} event The event source of the callback.
   * @param {number[]} value Array of indices of the blades that are expanded.
   */
  onChange?: (event: SyntheticEvent, value: number[]) => void;

  /**
   * The blades to be rendered within the group.
   * Must be instances of `HvBlade`, otherwise the behavior is undefined and will most likely break.
   */
  children: React.ReactNode;
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvBladesClasses;
}

function getExpandedBlades(
  defaultExpanded: number[] | undefined,
  children: React.ReactNode,
  atMostOneExpanded: boolean,
  atLeastOneExpanded: boolean,
) {
  const childrenArray = Children.toArray(children);
  const expandedBlades =
    defaultExpanded ??
    childrenArray
      .map((child: any, i: number) => {
        const childIsControlled = child?.props?.expanded !== undefined;
        const childIsExpanded = childIsControlled
          ? child?.props?.expanded
          : child?.props?.defaultExpanded;

        return childIsExpanded ? i : undefined;
      })
      .filter((v) => v !== undefined);

  const numberOfExpandedBlades = expandedBlades.length;
  if (
    atLeastOneExpanded &&
    numberOfExpandedBlades === 0 &&
    childrenArray.length > 0
  ) {
    return [0];
  }
  if (atMostOneExpanded && numberOfExpandedBlades > 1) {
    return [expandedBlades[0]];
  }

  return expandedBlades;
}

/**
 * `HvBlades` is a component that groups multiple `HvBlade` components.
 *
 * It allows for better control over the expanded state of blades, suitable for both
 * controlled and uncontrolled scenarios.
 */
export const HvBlades = (props: HvBladesProps) => {
  const {
    id,
    className,
    classes: classesProp,
    children,
    expanded: expandedProp,
    defaultExpanded,
    atMostOneExpanded = false,
    atLeastOneExpanded = false,
    fullWidthBlades = false,
    onChange,
    ...others
  } = useDefaultProps("HvBlades", props);

  const { classes, cx } = useClasses(classesProp);

  const [expanded, setExpanded] = useControlled(expandedProp, () =>
    getExpandedBlades(
      defaultExpanded,
      children,
      atMostOneExpanded,
      atLeastOneExpanded,
    ),
  );

  const onChildChangeInterceptor = useCallback(
    (
      index: number,
      childOnChange: (event: SyntheticEvent, isExpanded: boolean) => void,
      event: SyntheticEvent,
      isExpanded: boolean,
    ) => {
      const newValue: number[] = [];
      if (atMostOneExpanded) {
        if (isExpanded) {
          newValue.push(index);
        }
      } else {
        newValue.push(...(expanded as number[]));
        if (isExpanded) {
          newValue.push(index);
        } else {
          newValue.splice(newValue.indexOf(index), 1);
        }
      }

      if (atLeastOneExpanded && newValue.length === 0) {
        newValue.push(index);
      }

      childOnChange?.(event, isExpanded);

      onChange?.(event, newValue);

      // This will only run if uncontrolled
      setExpanded(newValue);
    },
    [onChange, expanded, setExpanded, atMostOneExpanded, atLeastOneExpanded],
  );

  const modifiedChildren = useMemo(() => {
    return Children.map(children, (child: any, i: number) => {
      const childIsExpanded = expanded.includes(i);

      return cloneElement(child, {
        expanded: childIsExpanded,
        fullWidth: child?.props?.fullWidth ?? fullWidthBlades,
        buttonProps: {
          ...child?.props?.buttonProps,
          "aria-disabled":
            // If the accordion panel associated with an accordion header is visible,
            // and if the accordion does not permit the panel to be collapsed, the header
            // button element has aria-disabled set to true.
            child?.props?.disabled ||
            (childIsExpanded && atMostOneExpanded && expanded.length === 1)
              ? true
              : undefined,
        },
        onChange: (
          event: React.ChangeEvent<HTMLInputElement>,
          isExpanded: boolean,
        ) =>
          onChildChangeInterceptor(
            i,
            child?.props?.onChange,
            event,
            isExpanded,
          ),
      });
    });
  }, [
    children,
    expanded,
    fullWidthBlades,
    atMostOneExpanded,
    onChildChangeInterceptor,
  ]);

  return (
    <div id={id} className={cx(classes.root, className)} {...others}>
      {modifiedChildren}
    </div>
  );
};
