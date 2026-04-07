import { forwardRef, useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvListContainer } from "../ListContainer";
import { HvOverflowTooltip } from "../OverflowTooltip";
import { HvPanel } from "../Panel";
import type { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import {
  HvAppSwitcherAction,
  type HvAppSwitcherActionApplication,
} from "./Action";
import { staticClasses, useClasses } from "./AppSwitcher.styles";

export { staticClasses as appSwitcherClasses };

export type HvAppSwitcherClasses = ExtractNames<typeof useClasses>;

export interface HvAppSwitcherProps extends HvBaseProps {
  /** Number of columns to render. One, two, or whatever fits the component's width. */
  layout?: "single" | "dual" | "fluid";
  /** Title to be displayed on the header of the component. */
  title?: string;
  /** The list of applications to be used to render the actions on the component. */
  applications?: HvAppSwitcherActionApplication[];
  /** Triggered when an action is clicked. */
  onActionClickedCallback?: (
    event: React.MouseEvent,
    application: HvAppSwitcherActionApplication,
  ) => void;
  /** Must return a boolean stating if the action element is selected or not. */
  isActionSelectedCallback?: (
    application: HvAppSwitcherActionApplication,
  ) => boolean;
  /** Element to be added to the header container, if none is provided a label with the title will be added. */
  header?: React.ReactNode;
  /** Element to be added to the footer container. */
  footer?: React.ReactNode;
  /**
   * Flag stating if the panel is opened or closed.
   *
   * @deprecated This logic should be external, i.e. using the HvAppSwitcher inside a Drawer component.
   */
  isOpen?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvAppSwitcherClasses;
}

/**
 * An app switcher lets users quickly navigate between different applications or modules within a platform.
 */
export const HvAppSwitcher = forwardRef<
  React.ComponentRef<typeof HvPanel>,
  HvAppSwitcherProps
>(function HvAppSwitcher(props, ref) {
  const {
    className,
    classes: classesProp,
    layout = "single",
    title,
    applications,
    onActionClickedCallback = () => {},
    isActionSelectedCallback = () => false,
    header,
    footer,
    isOpen,
    ...others
  } = useDefaultProps("HvAppSwitcher", props);
  const { classes, cx } = useClasses(classesProp);

  const panelActions = useMemo(
    () =>
      applications?.map((application) => {
        if (application.name) {
          return (
            <HvAppSwitcherAction
              key={application.id || `${application.name}_${application.url}`}
              application={application}
              onClickCallback={onActionClickedCallback}
              isSelectedCallback={isActionSelectedCallback}
              classes={{
                root: classes.item,
                selected: classes.itemSelected,
                disabled: classes.itemDisabled,
                typography: classes.itemTrigger,
                icon: classes.itemIcon,
                title: classes.itemTitle,
                iconInfo: classes.itemInfoIcon,
              }}
            />
          );
        }

        return undefined;
      }),
    [applications, classes, isActionSelectedCallback, onActionClickedCallback],
  );

  return (
    <HvPanel
      ref={ref}
      className={cx(
        classes.root,
        classes[layout],
        { [classes.open]: !!isOpen, [classes.closed]: isOpen === false },
        className,
      )}
      {...others}
    >
      {(header && (
        <HvTypography component="div" variant="label" className={classes.title}>
          {header}
        </HvTypography>
      )) ||
        (title && (
          <HvOverflowTooltip
            className={classes.title}
            data={title}
            placement="top-start"
            classes={{
              tooltipAnchorParagraph: classes.titleAnchor,
            }}
          />
        ))}
      <HvListContainer
        condensed
        disableGutters
        className={classes.actionsContainer}
      >
        {panelActions}
      </HvListContainer>
      {footer && (
        <HvTypography
          component="div"
          variant="label"
          className={classes.footerContainer}
        >
          {footer}
        </HvTypography>
      )}
    </HvPanel>
  );
});
