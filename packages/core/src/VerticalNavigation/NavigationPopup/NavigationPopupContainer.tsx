import { useMemo, useState } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import { getContainerElement } from "../../utils/document";
import { HvVerticalNavigation } from "../VerticalNavigation";
import { staticClasses, useClasses } from "./NavigationPopup.styles";

export { staticClasses as verticalNavigationPopupClasses };

export type HvVerticalNavigationPopupClasses = ExtractNames<typeof useClasses>;

export interface NavigationPopupContainerProps extends HvBaseProps {
  anchorEl?: HTMLElement | null;
  onClose?: () => void;
  classes?: HvVerticalNavigationPopupClasses;
}

export const NavigationPopupContainer = (
  props: NavigationPopupContainerProps,
) => {
  const {
    anchorEl,
    onClose,
    children,
    classes: classesProp,
    className,
    ...others
  } = useDefaultProps("HvVerticalNavigationPopup", props);

  const { classes, cx } = useClasses(classesProp);

  const { rootId } = useTheme();

  const [arrowRef, setArrowRef] = useState<HTMLElement | null>(null);

  const modifiers = useMemo(
    () => [
      { name: "arrow", options: { element: arrowRef } },
      // offset: [skid, distance] — 8px gap between anchor and Popper, filled by the arrow
      { name: "offset", options: { offset: [0, 8] } },
    ],
    [arrowRef],
  );

  const handleClickAway = () => onClose?.();

  return (
    <Popper
      open
      anchorEl={anchorEl}
      placement="right-start"
      container={getContainerElement(rootId)}
      modifiers={modifiers}
      className={cx(classes.popper, classes.popup, className)}
      {...others}
    >
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.wrapper}>
          <div ref={setArrowRef} className={classes.arrow} />
          <div className={classes.container}>
            <HvVerticalNavigation open useIcons>
              {children}
            </HvVerticalNavigation>
          </div>
        </div>
      </ClickAwayListener>
    </Popper>
  );
};
