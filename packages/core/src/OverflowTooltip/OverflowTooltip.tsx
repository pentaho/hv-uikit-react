import { useMemo, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTooltip, HvTooltipProps } from "../Tooltip";
import { staticClasses, useClasses } from "./OverflowTooltip.styles";

export { staticClasses as overflowTooltipClasses };
export type HvOverflowTooltipClasses = ExtractNames<typeof useClasses>;

export interface HvOverflowTooltipProps
  extends Omit<Partial<HvTooltipProps>, "classes" | "children"> {
  /** The node that will be rendered inside the tooltip. */
  data: React.ReactNode;
  /** If `true`, the overflow tooltip will always use the paragraph overflow style. */
  paragraphOverflow?: boolean;
  /** Extra properties to add to the tooltip. @deprecated pass properties directly to the component */
  tooltipsProps?: Partial<HvTooltipProps>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvOverflowTooltipClasses;
}

const isParagraph = (children = "") => /\s/.test(children);

/**
 * Displays a tooltip automatically when the text content overflows its container.
 */
export const HvOverflowTooltip = (props: HvOverflowTooltipProps) => {
  const {
    classes: classesProp,
    className,
    data,
    paragraphOverflow,
    tooltipsProps,
    ...others
  } = useDefaultProps("HvOverflowTooltip", props);

  const { classes, cx } = useClasses(classesProp);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isParag = useMemo(
    () => paragraphOverflow && isParagraph(data?.toString()),
    [data, paragraphOverflow],
  );

  const { ref } = useResizeDetector<HTMLDivElement>({
    refreshMode: "throttle",
    disableRerender: true,
    refreshRate: 100,
    refreshOptions: { trailing: true, leading: true },
    onResize({ width, height, entry }) {
      const { scrollHeight = 0, scrollWidth = 0 } = entry?.target || {};

      // The difference should be higher than a pixel to be considered as overflowing
      setIsOverflowing(
        isParag
          ? scrollHeight - (height || 0) >= 1
          : scrollWidth - (width || 0) >= 1,
      );
    },
  });

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
      disableHoverListener={!isOverflowing}
      classes={{ tooltip: classes.tooltipData }}
      title={data}
      // unset since `content` *is* the label
      aria-label={null as any}
      aria-labelledby={null as any}
      {...tooltipsProps}
      {...others}
    >
      {content}
    </HvTooltip>
  );
};
