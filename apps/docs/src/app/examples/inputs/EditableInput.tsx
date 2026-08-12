import { useRef, useState } from "react";
import {
  HvBaseInput,
  HvButton,
  HvIconButton,
  HvTypography,
} from "@pentaho/uikit-react-core";
import { Check, Close, Edit } from "@pentaho/uikit-react-icons";

export default function Demo() {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cachedValue, setCachedValue] = useState("John Doe");

  return editing ? (
    <form
      className="flex items-center gap-xs w-260px"
      onSubmit={(evt) => {
        evt.preventDefault();
        setCachedValue(inputRef.current?.value || "");
        setEditing(false);
      }}
      onReset={() => setEditing(false)}
    >
      <HvBaseInput ref={inputRef} autoFocus defaultValue={cachedValue} />
      <HvIconButton type="reset" size="xs" variant="negative" title="Cancel">
        <Close />
      </HvIconButton>
      <HvIconButton type="submit" size="xs" variant="positive" title="Save">
        <Check />
      </HvIconButton>
    </form>
  ) : (
    <div className="flex items-center gap-xs w-260px">
      <span className="capitalize">Name:</span>
      <HvTypography variant="label">{cachedValue}</HvTypography>
      <HvButton icon title="Edit" onClick={() => setEditing(true)}>
        <Edit />
      </HvButton>
    </div>
  );
}
