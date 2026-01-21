import { ClassNames } from "@emotion/react";

import { HvBaseSwitchProps } from "../../BaseSwitch";
import { HvButton } from "../../Button";
import { HvDropdownProps } from "../../Dropdown";
import { HvIcon } from "../../icons";
import { HvListValue } from "../../List";
import {
  HvOverflowTooltip,
  HvOverflowTooltipProps,
} from "../../OverflowTooltip";
import { HvTag, HvTagProps } from "../../Tag";
import { setId } from "../../utils/setId";
import type {
  HvCellProps,
  HvRowInstance,
  HvTableColumnConfig,
  HvTableHeaderRenderer,
} from "../hooks/useHvTable";
import { HvDateColumnCell } from "./DateColumnCell";
import { HvDropdownColumnCell } from "./DropdownColumnCell";
import { HvProgressColumnCell } from "./ProgressColumnCell";
import { HvSwitchColumnCell } from "./SwitchColumnCell";

const EM_DASH = "—";

export const hvStringFallback = (value: any) => {
  return typeof value === "string" && value !== "" ? value : EM_DASH;
};

export const hvNumberFallback = (value: any) => {
  return typeof value === "number" ? value : EM_DASH;
};

export const hvNodeFallback = (value: any) => {
  if (!value) return EM_DASH;
  return hvStringFallback(value?.toString()) === EM_DASH ? EM_DASH : value;
};

export function hvTextColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  col: HvTableColumnConfig<D, H>,
  overflowTooltipProps: Omit<HvOverflowTooltipProps, "data"> = {},
): HvTableColumnConfig<D, H> {
  return {
    Cell: ({ value }: HvCellProps<D, H>) => (
      <HvOverflowTooltip
        data={hvStringFallback(value)}
        {...overflowTooltipProps}
      />
    ),
    sortType: "alphanumeric",
    ...col,
  };
}

export function hvNumberColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(col: HvTableColumnConfig<D, H>): HvTableColumnConfig<D, H> {
  return {
    Cell: ({ value }: HvCellProps<D, H>) => <>{hvNumberFallback(value)}</>,
    align: "right",
    sortType: "number",
    ...col,
  };
}

export function hvDateColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(col: HvTableColumnConfig<D, H>): HvTableColumnConfig<D, H> {
  return {
    Cell: ({ value }: HvCellProps<D, H>) => <HvDateColumnCell date={value} />,
    sortType: "alphanumeric",
    sortDescFirst: true,
    ...col,
  };
}

export function hvExpandColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  col: HvTableColumnConfig<D, H>,
  expandRowButtonAriaLabel: string,
  collapseRowButtonAriaLabel: string,
  getCanRowExpand?: (row: HvRowInstance<D, H>) => boolean,
  ExpandedIcon: React.ReactNode = <HvIcon name="CaretDown" size="xs" rotate />,
  CollapsedIcon: React.ReactNode = <HvIcon name="CaretDown" size="xs" />,
): HvTableColumnConfig<D, H> {
  return {
    Cell: (cellProps: HvCellProps<D, H>) => {
      const { value, row } = cellProps;
      const expandedProps = row.getToggleRowExpandedProps?.();

      const hasContent = getCanRowExpand?.(row) ?? true;

      return (
        <ClassNames>
          {({ css }) => (
            <div
              className={css({
                display: "flex",
                alignItems: "center",
                position: "relative",
                left: -16,
              })}
            >
              {hasContent && (
                <HvButton
                  icon
                  aria-label={
                    row.isExpanded
                      ? collapseRowButtonAriaLabel
                      : expandRowButtonAriaLabel
                  }
                  aria-expanded={row.isExpanded}
                  onClick={expandedProps?.onClick}
                >
                  {row.isExpanded ? ExpandedIcon : CollapsedIcon}
                </HvButton>
              )}

              <HvOverflowTooltip data={hvStringFallback(value)} />
            </div>
          )}
        </ClassNames>
      );
    },
    sortType: "alphanumeric",
    cellStyle: {
      position: "relative",
    },
    ...col,
  };
}

export function hvTagColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
  A extends object = Record<string, unknown>,
>(
  col: HvTableColumnConfig<D, H>,
  valueDataKey: keyof A,
  colorDataKey: keyof A,
  textColorDataKey: keyof A,
  fromRowData = false,
  tagProps?: HvTagProps,
): HvTableColumnConfig<D, H> {
  return {
    Cell: (cellProps: HvCellProps<D, H>) => {
      const { value, row } = cellProps;
      if (!value) {
        return <>—</>;
      }

      const {
        [valueDataKey]: name,
        [colorDataKey]: color,
        [textColorDataKey]: textColor,
      } = fromRowData ? row.original : value;

      return (
        <HvTag
          label={name}
          type="semantic"
          color={color}
          style={textColor != null ? { color: textColor } : {}}
          tabIndex={-1}
          {...tagProps}
        />
      );
    },
    cellStyle: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ...col,
  };
}

// TODO - Review accessibility on the next renderers because they all differ

export function hvSwitchColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  col: HvTableColumnConfig<D, H>,
  switchLabel: string,
  falseLabel?: string,
  trueLabel?: string,
  switchProps?: HvBaseSwitchProps,
): HvTableColumnConfig<D, H> {
  return {
    Cell: (cellProps: HvCellProps<D, H>) => {
      const { value, row } = cellProps;
      return (
        <HvSwitchColumnCell
          checked={value}
          value={row.id}
          switchLabel={switchLabel}
          falseLabel={falseLabel}
          trueLabel={trueLabel}
          switchProps={switchProps}
        />
      );
    },
    cellStyle: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ...col,
  };
}

export function hvDropdownColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  col: HvTableColumnConfig<D, H>,
  id: string | undefined,
  placeholder: string,
  disabledPlaceholder: string,
  onChange?: (identifier: string, value: HvListValue) => void,
  dropdownProps?: HvDropdownProps<false>,
): HvTableColumnConfig<D, H> {
  return {
    Cell: (cellProps: HvCellProps<D, H>) => {
      const { value, row, column } = cellProps;
      const disabled =
        !Array.isArray(value) || (Array.isArray(value) && value.length < 1);
      return (
        <HvDropdownColumnCell
          values={value}
          placeholder={disabled ? disabledPlaceholder : placeholder}
          onChange={(val) => onChange?.(row.id, val!)}
          disabled={disabled}
          aria-labelledby={setId(id, column.id) || column.id || id} // TODO - to be reviewed because it doesn't make much sense
          {...dropdownProps}
        />
      );
    },
    cellStyle: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ...col,
  };
}

export function hvProgressColumn<
  D extends object = Record<string, unknown>,
  H extends HvTableHeaderRenderer | undefined = HvTableHeaderRenderer,
>(
  col: HvTableColumnConfig<D, H>,
  getPartial?: (row: HvRowInstance<D, H>) => number,
  getTotal?: (row: HvRowInstance<D, H>) => number,
  color?: "primary" | "secondary",
): HvTableColumnConfig<D, H> {
  return {
    Cell: (cellProps: HvCellProps<D, H>) => {
      const { row, column } = cellProps;
      const partial = getPartial?.(row) || 0;
      const total = getTotal?.(row);

      if (total) {
        return (
          <HvProgressColumnCell
            partial={partial}
            total={total}
            color={color}
            aria-labelledby={column.id}
          />
        );
      }

      return <>—</>;
    },

    cellStyle: {
      paddingTop: 0,
      paddingBottom: 0,
    },
    ...col,
  };
}
