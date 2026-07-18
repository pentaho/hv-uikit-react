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

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Skeleton.styles";

export { staticClasses as skeletonClasses };

export type HvSkeletonClasses = ExtractNames<typeof useClasses>;

export interface HvSkeletonProps extends HvBaseProps {
  /** Whether the skeleton element is hidden or not. */
  hidden?: boolean;
  /** The type of skeleton element. @default "text" */
  variant?: "circle" | "square" | "text";
  /** The animation the skeleton element will display. @default "pulse" */
  animation?: "pulse" | "wave";
  /** The width of the skeleton element. */
  width?: React.CSSProperties["width"];
  /** The height of the skeleton element. */
  height?: React.CSSProperties["height"];
  /** The url for a placeholder image to use on the skeleton element. */
  backgroundImage?: string;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSkeletonClasses;
}

/**
 * The Skeleton component displays a placeholder that mimics the shape and size of loading content.
 */
export const HvSkeleton = (props: HvSkeletonProps) => {
  const {
    classes: classesProp,
    className,
    children,
    hidden = false,
    variant = "text",
    animation = "pulse",
    backgroundImage,
    width,
    height,
    style,
    ...others
  } = useDefaultProps("HvSkeleton", props);
  const { classes, cx } = useClasses(classesProp);

  if (hidden) return <div className={classes.content}>{children}</div>;

  return (
    <div
      className={cx(
        classes.root,
        classes[variant],
        classes[animation],
        className,
      )}
      style={{
        width,
        height,
        ...(backgroundImage && {
          background: `center / contain no-repeat url(${backgroundImage})`,
        }),
        ...style,
      }}
      {...others}
    >
      {children}
    </div>
  );
};
