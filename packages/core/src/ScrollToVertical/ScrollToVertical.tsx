import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useScrollTo, type HvScrollToOption } from "../hooks/useScrollTo";
import { HvBaseProps } from "../types/generic";
import { isKey } from "../utils/keyboardUtils";
import {
  calculateOffset,
  staticClasses,
  useClasses,
} from "./ScrollToVertical.styles";
import { HvVerticalScrollListItem } from "./VerticalScrollListItem";

export { staticClasses as scrollToVerticalClasses };

export type HvScrollToVerticalClasses = ExtractNames<typeof useClasses>;

export interface HvScrollToVerticalProps
  extends HvBaseProps<HTMLOListElement, "onChange" | "onClick"> {
  /** An Array of Objects with Label and Value. Label is the displayed Element and Value is the local navigation location applied */
  options: HvScrollToOption[];
  /**
   * The navigation mode to be used when the user clicks on a tab element.
   * - `push` will add a new entry to the history stack.
   * - `replace` will replace the current entry on the history stack.
   * - `none` will not add any entry to the history stack.
   *
   * Defaults to `push`, unless the deprecated `href` prop is set to `false`, in which case it defaults to `none`.
   *
   * When set to `none`, then each element will render a button instead of a link.
   *
   * @default "push"
   */
  navigationMode?: "push" | "replace" | "none";
  /**
   * When set to `true`, the generated links will be relative (e.g. `#section`).
   * Relative URLs take into account not only the current location, but also the base URL if it is set (i.e. a `<base>` tag).
   * This can lead to unexpected behavior.
   *
   * When set to `false`, the links will be generated from the current location's full URL (e.g. `http://example.com/hello/world?value=123#section`).
   *
   * @default false
   */
  relativeLinks?: boolean;
  /** Default selected index passed from the parent. */
  defaultSelectedIndex?: number;
  /**
   * The Id of the scrollable container containing displayed elements.
   *
   * Defaults to `window` if unspecified.
   */
  scrollElementId?: string;
  /**
   * Defines the offset from the top of each element for getting an optimal viewing region in the container.
   * This allows to exclude regions of the container that are obscured by other content (such as fixed-positioned toolbars or titles)
   * or to put more breathing room between the targeted element and the edges of the container.
   *
   * Each element can also have a specific offset via the options property.
   */
  offset?: number;
  /** Position of the Vertical scroll to. */
  position?: "absolute" | "fixed" | "relative";
  /** Position of tooltip identifying the current item. */
  tooltipPosition?: "left" | "right" | "top" | "bottom";
  /** A function called each time the selected index changes. */
  onChange?: (
    event:
      | Event
      | React.MouseEvent<HTMLDivElement | HTMLAnchorElement>
      | React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>,
    index: number,
  ) => void;
  /** A function called each time an user clicks on a tab element. */
  onClick?: (
    event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>,
    index: number,
  ) => void;
  /** A function called each time an user press enter on a tab element. */
  onEnter?: (
    event: React.KeyboardEvent<HTMLDivElement | HTMLAnchorElement>,
    index: number,
  ) => void;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvScrollToVerticalClasses;
}

/**
 * The vertical scroll to element can be used to quickly navigate in a page.
 */
export const HvScrollToVertical = (props: HvScrollToVerticalProps) => {
  const {
    id,
    defaultSelectedIndex = 0,
    scrollElementId,
    navigationMode = "push",
    relativeLinks = false,
    onChange,
    onClick,
    onEnter,
    className,
    classes: classesProp,
    options,
    offset = 0,
    position = "relative",
    tooltipPosition = "left",
    style,
    ...others
  } = useDefaultProps("HvScrollToVertical", props);

  const { classes, cx } = useClasses(classesProp);

  const [selectedIndex, setScrollTo, elements] = useScrollTo(
    defaultSelectedIndex,
    scrollElementId,
    navigationMode,
    relativeLinks,
    offset,
    options,
    onChange,
  );

  const tabs = elements.map((option, index) => (
    <HvVerticalScrollListItem
      onClick={(event) => {
        event.preventDefault();

        setScrollTo(event, option.value, index, () => onChange?.(event, index));
        onClick?.(event, index);
      }}
      onKeyDown={(event) => {
        if (isKey(event, "Enter") !== true) return;
        event.preventDefault();

        setScrollTo(event, option.value, index, () => onChange?.(event, index));
        onEnter?.(event, index);
      }}
      href={navigationMode !== "none" ? option.href : undefined}
      tooltipPlacement={tooltipPosition}
      selected={selectedIndex === index}
      key={option.key || option.label}
      label={option.label}
    />
  ));

  const positionOffset = calculateOffset(options.length);

  return (
    <ol
      className={cx(
        classes.root,
        {
          [classes.positionFixed]: position === "fixed",
          [classes.positionAbsolute]: position === "absolute",
        },
        className,
      )}
      style={{ top: `calc(50% - ${positionOffset}px)`, ...style }}
      id={id}
      {...others}
    >
      {tabs}
    </ol>
  );
};
