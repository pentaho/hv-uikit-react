import {
  ClickAwayListener,
  ClickAwayListenerProps,
} from "@mui/base/ClickAwayListener";
import { Portal } from "@mui/base/Portal";
import { useCss, useTheme } from "@hitachivantara/uikit-react-utils";

import { HvPanel } from "../Panel";
import { getContainerElement } from "../utils/document";
import type {
  HvBaseDropdownClasses,
  HvBaseDropdownProps,
} from "./BaseDropdown";
import { useBaseDropdownContext } from "./context";

export interface BaseDropdownPanelProps
  extends Pick<
    HvBaseDropdownProps,
    "disablePortal" | "onClickOutside" | "children"
  > {
  classes: Required<HvBaseDropdownClasses>;
  containerId?: string;
  onContainerKeyDown: (event: any) => void;
  onClickAway: ClickAwayListenerProps["onClickAway"];
}

export const BaseDropdownPanel = ({
  classes,
  containerId,
  children,
  disablePortal,
  onContainerKeyDown,
  onClickAway,
}: BaseDropdownPanelProps) => {
  const { cx } = useCss();
  const { popperPlacement, popper, referenceElement, setPopperElement } =
    useBaseDropdownContext();

  const { rootId } = useTheme();

  const extensionWidth = referenceElement
    ? referenceElement?.offsetWidth
    : "inherit";

  const container = (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      ref={setPopperElement}
      className={classes.container}
      onKeyDown={onContainerKeyDown}
      style={popper?.styles.popper}
      {...popper?.attributes.popper}
    >
      {popperPlacement?.includes("bottom") && (
        <div
          style={{ width: extensionWidth }}
          className={cx(classes.inputExtensionOpen, {
            [classes.inputExtensionLeftPosition]:
              popperPlacement.includes("end"),
          })}
        />
      )}
      <HvPanel
        // TODO: review in v6. `containerId` needs to be on the role element (`children` has it)
        id={containerId}
        data-popper-placement={popperPlacement}
        className={classes.panel}
      >
        {children}
      </HvPanel>
      {popperPlacement?.includes("top") && (
        <div
          style={{ width: extensionWidth }}
          className={cx(
            classes.inputExtensionOpen,
            classes.inputExtensionOpenShadow,
            {
              [classes.inputExtensionFloatRight]:
                popperPlacement.includes("end"),
              [classes.inputExtensionFloatLeft]:
                popperPlacement.includes("start"),
            },
          )}
        />
      )}
    </div>
  );

  return (
    <Portal
      container={getContainerElement(rootId)}
      disablePortal={disablePortal}
    >
      <ClickAwayListener onClickAway={onClickAway}>
        {container}
      </ClickAwayListener>
    </Portal>
  );
};
