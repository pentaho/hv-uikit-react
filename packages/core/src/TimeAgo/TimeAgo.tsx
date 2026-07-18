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
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { DEFAULT_LOCALE } from "../Calendar/utils";
import {
  fixedForwardRef,
  type PolymorphicComponentRef,
  type PolymorphicRef,
} from "../types/generic";
import { HvTypography } from "../Typography";
import { staticClasses, useClasses } from "./TimeAgo.styles";
import useTimeAgo from "./useTimeAgo";

export { staticClasses as timeAgoClasses };

export type HvTimeAgoClasses = ExtractNames<typeof useClasses>;

export type HvTimeAgoProps<C extends React.ElementType = "p"> =
  PolymorphicComponentRef<
    C,
    {
      /**
       * The timestamp to format, in seconds or milliseconds.
       * Defaults to `emptyElement` if value is null or 0
       */
      timestamp?: number;
      /**
       * The locale to be used. Should be on of the JS supported locales
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl#locales_argument
       */
      locale?: Intl.LocalesArgument;
      /**
       * The element to render when the timestamp is null or 0
       * Defaults to `—` (Em Dash)
       */
      emptyElement?: React.ReactNode;
      /** Disables periodic date refreshes */
      disableRefresh?: boolean;
      /** Whether to show seconds in the rendered time */
      showSeconds?: boolean;
      /**
       * Whether the component should render just the string
       * Consider using `useTimeAgo` instead
       */
      justText?: boolean;
      /** A Jss Object used to override or extend the styles applied to the component. */
      classes?: HvTimeAgoClasses;
    }
  >;

/**
 * The HvTimeAgo component implements the Design System relative time format guidelines.
 */
export const HvTimeAgo = fixedForwardRef(function HvTimeAgo<
  C extends React.ElementType = "p",
>(props: HvTimeAgoProps<C>, ref: PolymorphicRef<C>) {
  const {
    classes: classesProp,
    className,
    timestamp,
    locale = DEFAULT_LOCALE,
    component: Component = HvTypography,
    emptyElement = "—",
    disableRefresh = false,
    showSeconds = false,
    justText = false,
    ...others
  } = useDefaultProps("HvTimeAgo", props);

  const { classes, cx } = useClasses(classesProp);
  const timeAgo = useTimeAgo(timestamp, {
    locale,
    disableRefresh,
    showSeconds,
  });

  if (justText && timestamp) return <>{timeAgo}</>;

  return (
    <Component ref={ref} className={cx(classes.root, className)} {...others}>
      {!timestamp ? emptyElement : timeAgo}
    </Component>
  );
});
