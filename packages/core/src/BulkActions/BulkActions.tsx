import { forwardRef } from "react";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionsGeneric, HvActionsGenericProps } from "../ActionsGeneric";
import { HvButton, HvButtonProps, HvButtonVariant } from "../Button";
import { HvCheckBox, HvCheckBoxProps } from "../CheckBox";
import { HvBaseProps } from "../types/generic";
import { CounterLabel } from "../utils/CounterLabel";
import { setId } from "../utils/setId";
import { staticClasses, useClasses } from "./BulkActions.styles";

export { staticClasses as bulkActionsClasses };

export type HvBulkActionsClasses = ExtractNames<typeof useClasses>;

export interface HvBulkActionsProps extends HvBaseProps {
  /** Custom label for select all checkbox. @deprecated no longer used */
  selectAllLabel?: React.ReactNode;
  /** Custom label for select all checkbox conjunction */
  selectAllConjunctionLabel?: string;
  /** Custom label for select all pages button */
  selectAllPagesLabel?: React.ReactNode;
  /** Whether select all pages element should be visible */
  showSelectAllPages?: boolean;
  /** The total number of elements */
  numTotal?: number;
  /** The number of elements currently selected */
  numSelected?: number;
  /** Function called when the "select all" Checkbox is toggled. */
  onSelectAll?: HvCheckBoxProps["onChange"];
  /** Function called when the "select all pages" button is clicked toggled. */
  onSelectAllPages?: HvButtonProps["onClick"];
  /** Whether the bulk actions should use the semantic styles when there are selected elements. */
  semantic?: boolean;
  /** The renderable content inside the right actions slot, or an array of actions `{ id, label, icon, disabled, ... }` */
  actions?: HvActionsGenericProps["actions"];
  /** Whether actions should be all disabled */
  actionsDisabled?: boolean;
  /** The callback function called when an action is triggered, receiving `action` as parameter. */
  onAction?: HvActionsGenericProps["onAction"];
  /** The number of maximum visible actions before they're collapsed into a `DropDownMenu`. */
  maxVisibleActions?: number;
  /** Properties to be passed onto the checkbox component, the values of the object are equivalent to the HvCheckbox API. */
  checkboxProps?: HvCheckBoxProps;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvBulkActionsClasses;
}

/**
 * Bulk Actions let users apply an action to one or multiple items at once, streamlining repetitive tasks.
 */
export const HvBulkActions = forwardRef<
  React.ComponentRef<"div">,
  HvBulkActionsProps
>(function HvBulkActions(props, ref) {
  const {
    id,
    className,
    classes: classesProp,
    selectAllPagesLabel,
    actionsDisabled,
    maxVisibleActions,
    checkboxProps,
    actions,
    numTotal = 0,
    numSelected = 0,
    selectAllConjunctionLabel = "/",
    showSelectAllPages = false,
    semantic = true,
    onAction,
    onSelectAll,
    onSelectAllPages,
    ...others
  } = useDefaultProps("HvBulkActions", props);

  const { classes, cx } = useClasses(classesProp);

  const { activeTheme } = useTheme();

  const anySelected = numSelected > 0;
  const isSemantic = semantic && anySelected;

  return (
    <div
      ref={ref}
      id={id}
      className={cx(
        classes.root,
        { [classes.semantic]: isSemantic },
        className,
      )}
      {...others}
    >
      <div className={classes.selectAllContainer}>
        <HvCheckBox
          id={setId(id, "select")}
          className={classes.selectAll}
          checked={numSelected > 0}
          semantic={isSemantic}
          onChange={onSelectAll}
          indeterminate={numSelected > 0 && numSelected < numTotal}
          label={
            <CounterLabel
              selected={numSelected}
              total={numTotal}
              conjunctionLabel={selectAllConjunctionLabel}
            />
          }
          {...checkboxProps}
        />
        {showSelectAllPages && anySelected && numSelected < numTotal && (
          <>
            <div className={classes.divider} />
            <HvButton
              id={setId(id, "pages")}
              className={classes.selectAllPages}
              variant={
                isSemantic
                  ? (activeTheme?.bulkActions
                      .actionButtonVariant as HvButtonVariant)
                  : "secondaryGhost"
              }
              onClick={onSelectAllPages}
            >
              {selectAllPagesLabel ?? `Select all ${numTotal} items`}
            </HvButton>
          </>
        )}
      </div>
      <HvActionsGeneric
        id={setId(id, "actions")}
        classes={{ root: classes.actions }}
        variant={
          isSemantic
            ? (activeTheme?.bulkActions.actionButtonVariant as HvButtonVariant)
            : "secondaryGhost"
        }
        actions={actions}
        disabled={actionsDisabled ?? numSelected === 0}
        onAction={onAction}
        maxVisibleActions={maxVisibleActions}
      />
    </div>
  );
});
