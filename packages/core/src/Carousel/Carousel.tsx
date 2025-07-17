import {
  Children,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useCarousel from "embla-carousel-react";
import {
  clamp,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../Button";
import { HvContainer } from "../Container";
import { useLabels } from "../hooks/useLabels";
import { HvIconButton, HvIconButtonProps } from "../IconButton";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import { staticClasses, useClasses } from "./Carousel.styles";
import { HvCarouselControls } from "./CarouselControls";
import { HvCarouselThumbnails } from "./CarouselThumbnails";

export { staticClasses as carouselClasses };

export type HvCarouselClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  close: "Close",
  fullscreen: "Fullscreen",
  backwards: "Backwards",
  forwards: "Forwards",
};

export interface HvCarouselProps
  extends HvBaseProps<HTMLDivElement, "title" | "onChange"> {
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCarouselClasses;
  /** Height of the Slider container. If `undefined`, images will keep a 16/9 aspect-ratio */
  height?: React.CSSProperties["height"];
  /** Width of the thumbnail. Height will try to maintain a 16/9 aspect-ratio */
  thumbnailWidth?: React.CSSProperties["width"];
  /** Title of the carousel */
  title?: React.ReactNode;
  /** Content slides to be displayed. @see `<HvCarouselSlide />` */
  children?: React.ReactNode;
  /** Custom content to render in the actions area */
  actions?: React.ReactNode;
  /** Whether Carousel is in "xs mode" - to use in embedded contexts */
  xs?: boolean;
  /** Whether to show dots instead of arrow pagination. Defaults to true under 5 elements */
  showDots?: boolean;
  /** Whether to show the counter on the top-right corner of the active slide */
  showCounter?: boolean;
  /** Whether to show the back/forwards buttons over the active slide */
  showSlideControls?: boolean;
  /** Whether to enable the fullscreen toggle button */
  showFullscreen?: boolean;
  /** Whether to hide the thumbnails. Hidden by default in "xs" mode */
  hideThumbnails?: boolean;
  /** Controls position. */
  controlsPosition?: "top" | "bottom";
  /** Thumbnails position. */
  thumbnailsPosition?: "top" | "bottom";
  /** Carousel configuration options. @see https://www.embla-carousel.com/api/options/ */
  carouselOptions?: Parameters<typeof useCarousel>[0];
  /** Function that renders the thumbnail.  */
  renderThumbnail?: (index: number) => React.ReactNode;
  /** The callback fired when the active slide changes. */
  onChange?: (index: number) => void;
  /** The callback fired fullscreen is toggled. */
  onFullscreen?: (
    event: React.MouseEvent<HTMLButtonElement>,
    isFullscreen: boolean,
  ) => void;
  /** Labels used on the component. */
  labels?: Partial<typeof DEFAULT_LABELS>;
}

/**
 A Carousel is used to browse content—commonly images, but also text, video, or charts. It highlights one item at a time while giving users a sense of the total content available.
 */
export const HvCarousel = forwardRef<
  React.ComponentRef<typeof HvContainer>,
  HvCarouselProps
>(function HvCarousel(props, ref) {
  const {
    className,
    classes: classesProp,
    height: heightProp = "auto",
    thumbnailWidth = 90,
    title,
    children,
    actions: actionsProp,
    xs,
    showDots: showDotsProp,
    showCounter: showCounterProp,
    showSlideControls,
    showFullscreen: showFullscreenProp,
    hideThumbnails: hideThumbnailsProp,
    controlsPosition: controlsPositionProp,
    thumbnailsPosition: thumbnailsPositionProp,
    labels: labelsProps,
    carouselOptions,
    renderThumbnail,
    onChange,
    onFullscreen,
    ...others
  } = useDefaultProps("HvCarousel", props);
  const { classes, cx } = useClasses(classesProp);
  const labels = useLabels(DEFAULT_LABELS, labelsProps);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const actionsPosition = "controls";
  const controlsPosition = controlsPositionProp ?? "top";
  const thumbnailsPosition = thumbnailsPositionProp ?? "bottom";

  const [containerRef, controller] = useCarousel({
    align: "start",
    loop: true,
    ...carouselOptions,
  });

  const [selectedIndex, setSelectedIndex] = useState(
    carouselOptions?.startIndex ?? 0,
  );

  const numSlides = Children.count(children);

  const handlePrevious = useCallback(() => {
    controller?.scrollPrev();
  }, [controller]);

  const handleNext = useCallback(() => {
    controller?.scrollNext();
  }, [controller]);

  const handleScroll = (index: number) => {
    controller?.scrollTo(index);
  };

  const handleSelect = useCallback(() => {
    if (!controller) return;

    const slideIndex = controller.selectedScrollSnap();
    setSelectedIndex(slideIndex);

    // scroll to thumbnail button
    thumbnailsRef.current
      ?.querySelectorAll("button")
      ?.[slideIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

    onChange?.(slideIndex);
  }, [controller, onChange]);

  useEffect(() => {
    if (!controller) return;

    controller.on("select", handleSelect);

    return () => {
      controller.off("select", handleSelect);
    };
  }, [controller, handleSelect]);

  useEffect(() => {
    if (!controller) return;

    controller.reInit();
    setSelectedIndex((currentIndex) => clamp(currentIndex, numSlides));
  }, [numSlides, controller]);

  const handleFullscreen: HvIconButtonProps["onClick"] = (event) => {
    onFullscreen?.(event, !isFullscreen);
    setIsFullscreen((curr) => !curr);
  };

  const canPrev = controller?.canScrollPrev() ?? false;
  const canNext = controller?.canScrollNext() ?? false;
  const showTitle = !!title && (!xs || isFullscreen);
  const showFullscreen = showFullscreenProp ?? xs;
  const height = isFullscreen ? "100%" : (heightProp ?? "auto");
  const showCounter = xs;
  const hideThumbnails = hideThumbnailsProp ?? (xs && !isFullscreen);
  const showThumbnails = !hideThumbnails && !!renderThumbnail;
  const showDots = showDotsProp ?? numSlides <= 5;

  const actions = (
    <div className={classes.actions}>
      {actionsProp}
      {showFullscreen && (
        <HvIconButton
          title={isFullscreen ? labels.close : labels.fullscreen}
          onClick={handleFullscreen}
          className={classes.closeButton}
        >
          <HvIcon name={isFullscreen ? "Close" : "Fullscreen"} />
        </HvIconButton>
      )}
    </div>
  );

  const controls = (
    <HvCarouselControls
      classes={classes}
      showDots={showDots}
      page={selectedIndex}
      pages={numSlides}
      canPrevious={canPrev}
      canNext={canNext}
      onPreviousClick={handlePrevious}
      onNextClick={handleNext}
      actions={actionsPosition === "controls" && actions}
      labels={{
        backwards: labels.backwards,
        forwards: labels.forwards,
      }}
    />
  );

  const thumbnails = showThumbnails && (
    <HvCarouselThumbnails
      classes={classes}
      ref={thumbnailsRef}
      page={selectedIndex}
      pages={numSlides}
      width={thumbnailWidth}
      onThumbnailClick={(evt, i) => handleScroll(i)}
      renderThumbnail={renderThumbnail}
    />
  );

  return (
    <HvContainer
      ref={ref}
      className={cx(classes.root, className, {
        [classes.xs]: xs,
        [classes.fullscreen]: isFullscreen,
      })}
      {...others}
    >
      {showTitle && (
        <HvTypography variant="title2" className={classes.title}>
          {title}
        </HvTypography>
      )}
      {thumbnailsPosition === "top" && thumbnails}
      {controlsPosition === "top" && controls}
      <div
        className={cx(classes.main, {
          [classes.mainXs]: xs,
          [classes.mainFullscreen]: isFullscreen,
        })}
      >
        {showCounter && (
          <div className={classes.counterContainer}>
            <span className={classes.counter}>
              {`${selectedIndex + 1}/${numSlides}`}
            </span>
          </div>
        )}

        {showSlideControls && (
          <div className={classes.slideControls}>
            <HvButton
              icon
              disabled={!canPrev}
              variant="secondarySubtle"
              aria-label={labels.backwards}
              onClick={handlePrevious}
            >
              <HvIcon name="Backwards" size="xs" />
            </HvButton>
            <HvButton
              icon
              disabled={!canNext}
              variant="secondarySubtle"
              aria-label={labels.forwards}
              onClick={handleNext}
            >
              <HvIcon name="Forwards" size="xs" />
            </HvButton>
          </div>
        )}

        <div
          ref={containerRef}
          style={{ height }}
          className={classes.slidesViewport}
        >
          <div className={classes.slidesContainer}>{children}</div>
        </div>
      </div>
      {controlsPosition === "bottom" && controls}
      {thumbnailsPosition === "bottom" && thumbnails}
    </HvContainer>
  );
});
