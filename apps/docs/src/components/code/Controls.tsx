/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useMemo } from "react";
import {
  HvCheckBox,
  HvColorPicker,
  HvInput,
  HvOption,
  HvRadio,
  HvRadioGroup,
  HvSelect,
  HvSlider,
  useTheme,
} from "@hitachivantara/uikit-react-core";

import type { ComponentMeta } from "../../utils/component";

type ControlType =
  | "check"
  | "color"
  | "number"
  | "radio"
  | "select"
  | "slider"
  | "text";

export type Control = {
  type?: ControlType;
  defaultValue?: any;
  values?: string[];
};

type ControlsProps = {
  prop: string;
  state: Record<string, any>;
  meta?: ComponentMeta;
  control: Control;
  onChange: (prop: string, value: unknown) => void;
};

const defaultMap: Record<string, ControlType> = {
  string: "text",
  number: "number",
  boolean: "check",
  enum: "select",
};

interface ControlProps extends ControlsProps {
  label: React.ReactNode;
  options: string[];
}

/**  Utility to clean up values (e.g., remove quotes) */
const cleanValue = (value: string) => value.replace(/"/g, "");

/** HvSlider control for enum types with multiple options */
function SliderControl({
  prop,
  state,
  control,
  onChange,
  label,
  options,
}: ControlProps) {
  // Find the index of the current value in the options
  const findCurrentIndex = (value: string) =>
    options.findIndex((opt) => cleanValue(opt) === value) + 1;

  const max = options.length;

  return (
    <HvSlider
      label={label}
      hideInput
      minPointValue={1}
      maxPointValue={max}
      markStep={1}
      divisionQuantity={max - 1}
      className="w-full pt-0"
      classes={{
        sliderContainer: "px-sm",
        labelContainer: "mx-0",
      }}
      values={[
        findCurrentIndex(String(state[prop])) ||
          findCurrentIndex(String(control.defaultValue)),
      ]}
      formatMark={(value) => cleanValue(options[Number(value) - 1] || "")}
      formatTooltip={(value) => cleanValue(options[Number(value) - 1] || "")}
      onChange={(values) => onChange(prop, cleanValue(options[values[0] - 1]))}
    />
  );
}

/** `HvRadio` button group for enum types */
function RadioControl({
  prop,
  state,
  control,
  onChange,
  label,
  options,
}: ControlProps) {
  return (
    <HvRadioGroup
      label={label}
      orientation="horizontal"
      value={state[prop] || control.defaultValue}
      onChange={(e, value) => onChange(prop, value)}
      className="w-full"
    >
      {options.map((v) => {
        const value = cleanValue(v);
        return <HvRadio key={value} label={value} value={value} />;
      })}
    </HvRadioGroup>
  );
}

/** `HvSelect` dropdown for enum types */
function SelectControl({
  prop,
  state,
  control,
  onChange,
  label,
  options,
}: ControlProps) {
  return (
    <HvSelect
      key={prop}
      value={state[prop] || control.defaultValue}
      label={label}
      className="w-full min-w-[100px]"
      onChange={(e, value) => onChange(prop, value ?? "")}
    >
      {options.map((v) => {
        const value = cleanValue(v);
        return (
          <HvOption value={value} key={value} label={value}>
            {value}
          </HvOption>
        );
      })}
    </HvSelect>
  );
}

/** `HvCheckbox` for boolean types */
function CheckboxControl({ prop, state, onChange, label }: ControlProps) {
  return (
    <HvCheckBox
      key={prop}
      label={label}
      checked={!!state[prop]}
      onChange={(e, value) => onChange(prop, value)}
    />
  );
}

/** `HvInput` for text types */
function InputControl({ prop, state, control, onChange, label }: ControlProps) {
  return (
    <HvInput
      key={prop}
      label={label}
      value={String(state[prop] ?? control.defaultValue)}
      onChange={(e, value) => onChange(prop, value)}
      className="w-full"
      disableClear
    />
  );
}

/** `HvInput` for number types */
function NumberInputControl({
  prop,
  state,
  control,
  onChange,
  label,
}: ControlProps) {
  return (
    <HvInput
      key={prop}
      label={label}
      inputProps={{ type: "number" }}
      value={state[prop] ?? control.defaultValue}
      onChange={(e, value) => onChange(prop, Number(value))}
      className="w-full"
      disableClear
    />
  );
}

/** `HvColorPicker` for color types */
function ColorControl({ prop, state, control, onChange, label }: ControlProps) {
  const { colors } = useTheme();

  return (
    <HvColorPicker
      key={prop}
      label={label}
      value={
        typeof state[prop] === "string" && state[prop].includes("#")
          ? state[prop]
          : colors?.[state[prop] as string] || control.defaultValue
      }
      onChange={(value) => onChange(prop, value)}
      className="w-full"
      recommendedColors={[
        "positive",
        "negative",
        "warning",
        "info",
        "accent",
        "catastrophic",
        "primary",
        "secondary",
        "cat1",
        "cat2",
        "gold",
        "coral",
      ]}
    />
  );
}

export const Controls = ({
  prop,
  state,
  meta,
  control,
  onChange,
}: ControlsProps) => {
  const propMeta = meta?.docgen.props[prop];

  const type: ControlType =
    control?.type ||
    (propMeta?.type?.name && defaultMap[propMeta?.type?.name]) ||
    defaultMap[typeof control.defaultValue] ||
    "text";

  const options = useMemo<string[]>(() => {
    const propValues: { value: string }[] | undefined = propMeta?.type?.value;
    return control.values || propValues?.map((v) => v.value) || [];
  }, [propMeta?.type?.value, control.values]);

  /** Map of renderers for specific control types */
  const rendererMap: Record<
    ControlType,
    React.ElementType<ControlProps> | undefined
  > = {
    slider: SliderControl,
    radio: RadioControl,
    check: CheckboxControl,
    color: ColorControl,
    number: NumberInputControl,
    text: InputControl,
    select: SelectControl,
  };

  const ControlComponent = rendererMap[type];

  if (!ControlComponent) {
    // eslint-disable-next-line no-console
    console.error(`Control for "${prop}" not supported: ${type}`);
    return null;
  }

  return (
    <ControlComponent
      prop={prop}
      state={state}
      meta={meta}
      control={control}
      onChange={onChange}
      // TODO: consider adding `capitalize` or `.nextra-code`
      label={<code>{prop}</code>}
      options={options}
    />
  );
};
