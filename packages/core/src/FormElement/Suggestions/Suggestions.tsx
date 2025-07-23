import { forwardRef, useContext, useRef } from "react";
import {
  ClickAwayListener,
  ClickAwayListenerProps,
} from "@mui/base/ClickAwayListener";
import { Popper, PopperProps } from "@mui/base/Popper";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvListItem } from "../../ListContainer";
import { HvSelectionList } from "../../SelectionList";
import { HvBaseProps } from "../../types/generic";
import { getContainerElement } from "../../utils/document";
import { setId } from "../../utils/setId";
import { HvFormElementContext } from "../context";
import { staticClasses, useClasses } from "./Suggestions.styles";

export { staticClasses as suggestionsClasses };

export type HvSuggestionsClasses = ExtractNames<typeof useClasses>;

export interface HvSuggestion {
  id?: string;
  label: React.ReactNode;
  value?: string;
  disabled?: boolean;
}

export interface HvSuggestionsProps extends HvBaseProps {
  /** Whether suggestions is visible */
  open?: boolean;
  /** The HTML element Suggestions attaches to. */
  anchorEl?: HTMLElement | null;
  /** Array of { id, label, ...others } values to display in the suggestion list */
  suggestionValues?: HvSuggestion[] | null;
  /** Function called when a suggestion is selected */
  onSuggestionSelected?: (event: React.MouseEvent, value: HvSuggestion) => void;
  /** Function called when suggestion list is closed */
  onClose?: ClickAwayListenerProps["onClickAway"];
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSuggestionsClasses;
  /**
   * If enabled, the suggestions list will be rendered using a portal.
   * If disabled, it will be under the DOM hierarchy of the parent component.
   * @default false
   * */
  enablePortal?: boolean;
  /** Props passed to the underlying MUI Popper component */
  popperProps?: Partial<PopperProps>;
}

export const HvSuggestions = forwardRef<
  // no-indent
  unknown,
  HvSuggestionsProps
>(function HvSuggestions(props, extRef) {
  const {
    id: idProp,
    className,
    classes: classesProp,
    enablePortal,
    open: openProp = false,
    anchorEl,
    suggestionValues,
    onClose,
    onSuggestionSelected,
    popperProps,
    ...others
  } = useDefaultProps("HvSuggestions", props);

  const { classes, cx } = useClasses(classesProp);

  const { rootId } = useTheme();

  const context = useContext(HvFormElementContext);
  const id = idProp ?? setId(context.id, "suggestions");

  const ref = useRef<HTMLDivElement>(null);
  const forkedRef = useForkRef(ref, extRef);

  return (
    <div
      id={id}
      ref={forkedRef}
      className={cx(classes.root, className)}
      {...others}
    >
      <ClickAwayListener onClickAway={onClose!}>
        <Popper
          style={{
            // @ts-ignore
            "--popper-width": enablePortal
              ? `${anchorEl?.clientWidth}px`
              : "100%",
          }}
          open={openProp}
          disablePortal={!enablePortal}
          container={enablePortal ? getContainerElement(rootId) : undefined}
          anchorEl={anchorEl}
          className={cx(classes.popper, {
            [classes.portal]: enablePortal,
          })}
          {...popperProps}
        >
          <HvSelectionList
            className={classes.list}
            id={setId(id, "list")}
            onChange={onSuggestionSelected}
          >
            {suggestionValues?.map((item) => (
              <HvListItem key={item.id} value={item} disabled={item.disabled}>
                {item.label}
              </HvListItem>
            ))}
          </HvSelectionList>
        </Popper>
      </ClickAwayListener>
    </div>
  );
});
