import { useMemo } from "react";
import {
  useResizeDetector,
  useResizeDetectorProps,
} from "react-resize-detector";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTooltip, HvTooltipProps } from "../Tooltip";
import { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./OverflowTooltip.styles";

export { staticClasses as overflowTooltipClasses };
export type HvOverflowTooltipClasses = ExtractNames<typeof useClasses>;

export interface HvOverflowTooltipProps extends HvBaseProps {
  /** The node that will be rendered inside the tooltip. */
  data: React.ReactNode;
  /** If true, the tooltip is shown. */
  open?: boolean;
  /** If `true`, the overflow tooltip will always use the paragraph overflow style. */
  paragraphOverflow?: boolean;
  /** Tooltip placement. */
  placement?:
    | "bottom-end"
    | "bottom-start"
    | "bottom"
    | "left-end"
    | "left-start"
    | "left"
    | "right-end"
    | "right-start"
    | "right"
    | "top-end"
    | "top-start"
    | "top";
  /** Extra properties to add to the tooltip. */
  tooltipsProps?: Partial<HvTooltipProps>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvOverflowTooltipClasses;
  /** Override the default options passed to react-resize-detector's useResizeDetector hook. */
  resizeDetectorProps?: Partial<useResizeDetectorProps<HTMLDivElement>>;
}

const isParagraph = (children = "") => /\s/.test(children);

/**
 * Displays a tooltip automatically when the text content overflows its container.
 */
export const HvOverflowTooltip = (props: HvOverflowTooltipProps) => {
  const {
    id,
    classes: classesProp,
    className,
    data,
    open,
    paragraphOverflow,
    placement = "top-start",
    tooltipsProps,
  } = useDefaultProps("HvOverflowTooltip", props);

  const { classes, cx } = useClasses(classesProp);

  const {
    height = 0,
    width = 0,
    ref,
  } = useResizeDetector({
    refreshMode: "debounce",
    handleHeight: false,
    ...props.resizeDetectorProps,
    refreshOptions: {
      trailing: true,
      ...props.resizeDetectorProps?.refreshOptions,
    },
  });

  const isParag = useMemo(
    () => paragraphOverflow && isParagraph(data?.toString()),
    [data, paragraphOverflow],
  );

  // The difference should be higher than a pixel to be considered as overflowing
  const isOverflowing = useMemo(() => {
    if (isParag) {
      const scrollHeight = ref.current?.scrollHeight || 0;

      return scrollHeight - height >= 1;
    }

    const scrollWidth = ref.current?.scrollWidth || 0;

    return scrollWidth - width >= 1;
  }, [height, isParag, ref, width]);

  const content = useMemo(
    () => (
      <div
        ref={ref}
        className={cx(
          {
            [classes.tooltipAnchor]: !isParag,
            [classes.tooltipAnchorParagraph]: isParag,
          },
          className,
        )}
      >
        {data}
      </div>
    ),
    [
      className,
      classes.tooltipAnchor,
      classes.tooltipAnchorParagraph,
      cx,
      data,
      isParag,
      ref,
    ],
  );

  return (
    <HvTooltip
      id={id}
      disableHoverListener={!isOverflowing}
      open={open}
      placement={placement}
      classes={{ tooltip: classes.tooltipData }}
      title={data}
      // unset since `content` *is* the label
      aria-label={null as any}
      aria-labelledby={null as any}
      {...tooltipsProps}
    >
      {content}
    </HvTooltip>
  );
};
