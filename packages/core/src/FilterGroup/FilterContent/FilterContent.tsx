import { forwardRef, useContext, useMemo, useRef, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionBar } from "../../ActionBar";
import { HvBaseDropdown, HvBaseDropdownProps } from "../../BaseDropdown";
import { HvButton } from "../../Button";
import { HvFormStatus } from "../../FormElement";
import { HvIcon } from "../../icons";
import { HvTypography } from "../../Typography";
import { setId } from "../../utils/setId";
import { HvFilterGroupCounter } from "../Counter";
import type { HvFilterGroupLabels } from "../FilterGroup";
import { HvFilterGroupContext } from "../FilterGroupContext";
import { HvFilterGroupLeftPanel } from "../LeftPanel";
import { HvFilterGroupRightPanel } from "../RightPanel";
import { HvFilterGroupHorizontalPlacement, HvFilterGroupValue } from "../types";
import { staticClasses, useClasses } from "./FilterContent.styles";

export { staticClasses as filterGroupContentClasses };

export type HvFilterGroupContentClasses = ExtractNames<typeof useClasses>;

export interface HvFilterGroupContentProps
  extends Omit<HvBaseDropdownProps, "onChange"> {
  description?: React.ReactNode;
  status?: HvFormStatus;
  onChange?: (
    event: React.MouseEvent<HTMLButtonElement>,
    value?: HvFilterGroupValue,
  ) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement> | Event) => void;
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  labels?: HvFilterGroupLabels;
  horizontalPlacement?: HvFilterGroupHorizontalPlacement;
  disablePortal?: boolean;
  escapeWithReference?: boolean;
  height?: string | number;
  leftEmptyElement?: React.ReactNode;
  rightEmptyElement?: React.ReactNode;
  disabled?: boolean;
  classes?: HvFilterGroupContentClasses;
}

export const HvFilterGroupContent = forwardRef<
  HTMLDivElement,
  HvFilterGroupContentProps
>(function HvFilterGroupContent(props, ref) {
  const {
    id,
    status,
    disabled = false,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    description,
    "aria-describedby": ariaDescribedBy,
    onChange,
    onCancel,
    onClear,
    labels,
    horizontalPlacement = "right",
    disablePortal = true,
    escapeWithReference = true,
    height,
    leftEmptyElement,
    rightEmptyElement,
    classes: classesProp,
    ...others
  } = useDefaultProps("HvFilterGroupContent", props);

  const { classes } = useClasses(classesProp);

  const [filterGroupOpen, setFilterGroupOpen] = useState<boolean>(false);

  const {
    defaultValue,
    filterValues,
    rollbackFilters,
    clearFilters,
    applyFilters,
    applyDisabled,
  } = useContext(HvFilterGroupContext);

  const focusTarget = useRef<HTMLDivElement>(null);

  const focusOnContainer = () => {
    focusTarget.current?.focus();
  };

  const onApplyHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    applyFilters();
    onChange?.(event, filterValues);
    setFilterGroupOpen(false);
  };

  const onCancelHandler = (
    event: React.MouseEvent<HTMLButtonElement> | Event,
  ) => {
    rollbackFilters();
    onCancel?.(event);
    setFilterGroupOpen(false);
  };

  const onClearHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    clearFilters();
    onClear?.(event);
  };

  const handleToggle = (event: Event, open: boolean) => {
    /* 
     If evt is null this toggle wasn't triggered by the user.
     instead it was triggered by the baseDropdown useEffect after
     the datepicker changed the expanded value this baseDropdown behavior needs a review
    */
    if (event === null) return;
    setFilterGroupOpen(open);
    if (!open) onCancelHandler?.(event);
  };

  const Header = useMemo(
    () => (
      <>
        <HvIcon name="Filters" />
        <HvTypography variant="label">{labels?.placeholder}</HvTypography>
      </>
    ),
    [labels?.placeholder],
  );

  return (
    <HvBaseDropdown
      ref={ref}
      id={setId(id, "dropdown")}
      role="combobox"
      classes={{
        root: classes.dropdown,
        panel: classes.panel,
        selection: classes.baseDropdownSelection,
        header: classes.header,
      }}
      disabled={disabled}
      disablePortal={disablePortal}
      variableWidth
      placement={horizontalPlacement}
      expanded={filterGroupOpen}
      onToggle={handleToggle}
      onClickOutside={onCancelHandler}
      onContainerCreation={focusOnContainer}
      placeholder={Header}
      adornment={<HvFilterGroupCounter />}
      popperProps={{
        modifiers: [{ name: "preventOverflow", enabled: escapeWithReference }],
      }}
      aria-haspopup="dialog"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-invalid={status === "invalid" ? true : undefined}
      aria-errormessage={status === "invalid" ? setId(id, "error") : undefined}
      aria-describedby={
        [description && setId(id, "description"), ariaDescribedBy]
          .join(" ")
          .trim() || undefined
      }
      {...others}
    >
      <div ref={focusTarget} tabIndex={-1} />
      <div className={classes.root} style={{ height }}>
        <HvFilterGroupLeftPanel
          id={id}
          className={classes.leftSidePanel}
          emptyElement={leftEmptyElement}
        />
        <HvFilterGroupRightPanel
          id={id}
          className={classes.rightSidePanel}
          emptyElement={rightEmptyElement}
          labels={labels}
        />
      </div>
      <HvActionBar className={classes.actionBar}>
        <HvButton
          id={setId(id, "clearFilters-button")}
          disabled={
            defaultValue
              ? defaultValue?.flat().length === filterValues?.flat().length
              : filterValues?.flat().length === 0
          }
          variant="secondaryGhost"
          onClick={onClearHandler}
        >
          {labels?.clearLabel}
        </HvButton>
        <div aria-hidden="true" className={classes.space}>
          &nbsp;
        </div>
        <HvButton
          id={setId(id, "apply-button")}
          disabled={applyDisabled}
          variant="primary"
          onClick={onApplyHandler}
          className={classes.applyButton}
        >
          {labels?.applyLabel}
        </HvButton>
        <HvButton
          id={setId(id, "cancel-button")}
          variant="secondarySubtle"
          onClick={onCancelHandler}
        >
          {labels?.cancelLabel}
        </HvButton>
      </HvActionBar>
    </HvBaseDropdown>
  );
});
