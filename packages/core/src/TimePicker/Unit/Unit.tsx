import type {
  DateFieldState,
  DateSegment,
} from "react-stately/useDateFieldState";
import { theme } from "@hitachivantara/uikit-styles";

import { HvBaseInput, type HvBaseInputProps } from "../../BaseInput";
import { HvButton } from "../../Button";
import { HvIcon } from "../../icons";
import { useClasses } from "./Unit.styles";

interface UnitProps {
  id?: string;
  state: DateFieldState;
  segment: DateSegment;
  placeholder?: string;
  /** Called when the value changes */
  onChange?: HvBaseInputProps["onChange"];
  /** Called when the up/add arrow is pressed */
  onAdd?: () => void;
  /** Called when the down/subtract arrow is pressed */
  onSub?: () => void;
}

export const Unit = ({
  id,
  state,
  segment,
  placeholder: placeholderProp,
  onChange,
  onAdd,
  onSub,
}: UnitProps) => {
  const { classes } = useClasses();
  const { type, text } = segment;
  const placeholder = placeholderProp ?? segment.placeholder;

  return (
    <div className={classes.root}>
      {type !== "literal" && (
        <HvIcon name="CaretDown" size="xs" rotate onClick={onAdd} />
      )}
      {type === "literal" && <div className={classes.separator}>{text}</div>}
      {type === "dayPeriod" && (
        <HvButton icon className={classes.periodToggle} onClick={onAdd}>
          {text}
        </HvButton>
      )}
      {["hour", "minute", "second"].includes(type) && (
        <HvBaseInput
          id={id}
          style={{
            ...theme.typography.title3,
          }}
          classes={{
            input: classes.input,
            root: classes.inputRoot,
          }}
          onKeyDown={(event) => {
            if ("key" in event && event.key === "Enter") {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          required
          invalid={state.isInvalid}
          value={text.padStart(2, "0")}
          onChange={onChange}
          placeholder={placeholder}
          inputProps={{ autoComplete: "off", type: "number" }}
        />
      )}
      {type !== "literal" && (
        <HvIcon name="CaretDown" size="xs" onClick={onSub} />
      )}
    </div>
  );
};
