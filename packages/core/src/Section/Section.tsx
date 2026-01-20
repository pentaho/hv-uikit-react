import { forwardRef, useRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton, HvButtonProps } from "../Button";
import { useExpandable } from "../hooks/useExpandable";
import { HvIcon } from "../icons";
import { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Section.styles";

export { staticClasses as sectionClasses };

export type HvSectionClasses = ExtractNames<typeof useClasses>;

export interface HvSectionProps
  extends Omit<HvBaseProps<HTMLDivElement>, "title" | "onToggle"> {
  /** The title of the section */
  title?: React.ReactNode;
  /** Whether or not the section is expandable.  */
  expandable?: boolean;
  /** Whether or not the section header is expandable. If true, the header will be clickable and will toggle the section content. */
  expandableHeader?: boolean;
  /** Whether the section is open or not, if this property is defined the accordion must be fully controlled. */
  expanded?: boolean;
  /** When uncontrolled, defines the initial expanded state. */
  defaultExpanded?: boolean;
  /** Section actions */
  actions?: React.ReactNode;
  /** Section onExpand callback */
  onToggle?: (
    event: React.MouseEvent<HTMLButtonElement>,
    open: boolean,
  ) => void;
  /** Props to be passed to the expand button */
  expandButtonProps?: HvButtonProps;
  /** Determines whether or not the header has a shadow on the bottom border. */
  raisedHeader?: boolean;
  /** A Jss Object used to override or extend the styles applied to the empty state component. */
  classes?: HvSectionClasses;
  /** Content container ref. */
  contentRef?: React.Ref<HTMLDivElement>;
}

/**
 * Sections allow grouping information on a page under the same topic.
 */
export const HvSection = forwardRef<HTMLDivElement, HvSectionProps>(
  function HvSection(props, ref) {
    const {
      classes: classesProp,
      className,
      title,
      expandable,
      expanded,
      expandableHeader,
      defaultExpanded = true,
      actions,
      onToggle,
      expandButtonProps,
      raisedHeader,
      contentRef,
      children,
      ...others
    } = useDefaultProps("HvSection", props);
    const { classes, cx } = useClasses(classesProp);
    const expandButtonRef = useRef<HTMLButtonElement>(null);

    const { isOpen, toggleOpen, buttonProps, regionProps } = useExpandable({
      expanded,
      defaultExpanded,
    });

    const hasHeader = title || actions || expandable;

    return (
      <div
        ref={ref}
        className={cx(classes.root, className, {
          [classes.raisedHeader]: hasHeader && raisedHeader && isOpen,
        })}
        {...others}
      >
        {hasHeader && (
          <div
            className={cx(classes.header, {
              [classes.headerExpandable]: expandable && expandableHeader,
            })}
            // eslint-disable-next-line click-events-have-key-events
            onClick={() => {
              if (!expandableHeader) return;
              expandButtonRef.current?.click();
            }}
          >
            {expandable && (
              <HvButton
                ref={expandButtonRef}
                icon
                onClick={(event) => {
                  event.stopPropagation();
                  toggleOpen();
                  onToggle?.(event, !isOpen);
                }}
                aria-label={isOpen ? "Collapse" : "Expand"}
                {...buttonProps}
                {...expandButtonProps}
              >
                <HvIcon name="CaretDown" size="xs" rotate={isOpen} />
              </HvButton>
            )}
            {title}
            <div
              className={classes.actions}
              // eslint-disable-next-line click-events-have-key-events
              onClick={(evt) => {
                evt.stopPropagation();
              }}
            >
              {actions}
            </div>
          </div>
        )}
        <div
          ref={contentRef}
          hidden={expandable && !isOpen}
          className={cx(classes.content, {
            [classes.hidden]: expandable && !isOpen,
            [classes.hasHeader]: hasHeader,
          })}
          {...(expandable && regionProps)}
        >
          {children}
        </div>
      </div>
    );
  },
);
