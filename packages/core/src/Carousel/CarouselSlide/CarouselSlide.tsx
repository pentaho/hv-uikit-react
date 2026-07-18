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
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { useClasses } from "./CarouselSlide.styles";

export type HvCarouselSlideClasses = ExtractNames<typeof useClasses>;

export interface HvCarouselSlideProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCarouselSlideClasses;
  /** The width of the Slide. Defaults to `100%` */
  size?: string;
  /** Content of a slide to be displayed */
  children?: React.ReactNode;
}

/**
 * A container to use as `children` of `HvCarousel`.
 * Pass `img` props directly to it, or `children` for any custom content
 */
export const HvCarouselSlide = ({
  classes: classesProp,
  className,
  children,
  size: flexBasis = "100%",
  src,
  alt,
  ...props
}: HvCarouselSlideProps) => {
  const { classes, css, cx } = useClasses(classesProp);
  return (
    <div
      className={cx(
        css({ flex: `0 0 ${flexBasis}` }),
        classes.slide,
        className,
      )}
    >
      {children ?? (
        <img className={classes.image} src={src} alt={alt} {...props} />
      )}
    </div>
  );
};
