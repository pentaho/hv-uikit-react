import { forwardRef } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvButton, type HvButtonProps } from "../Button";
import type { HvPaginationProps } from "../Pagination";
import { HvStack } from "../Stack";
import type { HvBaseProps } from "../types/generic";
import { useClasses } from "./Carousel.styles";

interface HvCarouselThumbnailsProps
  extends HvBaseProps<HTMLDivElement, "children">,
    Pick<HvPaginationProps, "page" | "pages" | "canPrevious" | "canNext"> {
  width?: React.CSSProperties["width"];
  classes?: ExtractNames<typeof useClasses>;
  onThumbnailClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => void;
  thumbnailProps?: Partial<HvButtonProps>;
  showDots?: boolean;
  renderThumbnail?: (index: number) => React.ReactNode;
}

export const HvCarouselThumbnails = forwardRef<
  HTMLDivElement,
  HvCarouselThumbnailsProps
>(function HvCarouselThumbnails(props, ref) {
  const {
    classes: classesProp,
    className,
    page,
    pages,
    width,
    renderThumbnail,
    onThumbnailClick,
    thumbnailProps,
    ...others
  } = props;
  const { classes, cx } = useClasses(classesProp);

  const selectedIndex = page || 0;
  const numSlides = pages;

  return (
    <div ref={ref} className={cx(classes.panel, className)} {...others}>
      <HvStack direction="row" spacing="xs">
        {Array.from(Array(numSlides)).map((doc, i) => (
          <HvButton
            icon
            key={`thumbnail-${i}`}
            style={{ width }}
            variant="secondaryGhost"
            className={cx(classes.thumbnail, {
              [classes.thumbnailSelected]: i === selectedIndex,
            })}
            onClick={(event) => onThumbnailClick?.(event, i)}
            {...thumbnailProps}
          >
            {renderThumbnail?.(i)}
          </HvButton>
        ))}
      </HvStack>
    </div>
  );
});
