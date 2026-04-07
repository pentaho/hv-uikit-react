import { useState } from "react";
import { createClasses } from "@hitachivantara/uikit-react-utils";

import type { HvFormStatus } from "../../FormElement";
import { HvInput } from "../../Input";
import { useQueryBuilderContext } from "../Context";

const { useClasses } = createClasses("HvQueryBuilderTextValue", {
  location: {
    flexGrow: 1,
  },
});

export interface TextValueProps {
  id: React.Key;
  value?: any;
  initialTouched?: boolean;
}

export const TextValue = ({
  id,
  value = "",
  initialTouched = false,
}: TextValueProps) => {
  const { classes } = useClasses();

  const { labels, dispatchAction, readOnly } = useQueryBuilderContext();

  const [touched, setTouched] = useState(initialTouched);

  const isValid = value != null && value.toString().trim() !== "";

  let status: HvFormStatus = isValid ? "valid" : "invalid";
  status = !touched ? "standBy" : status;

  return (
    <HvInput
      className={classes.location}
      label={labels.rule.value.text.label}
      required
      status={status}
      statusMessage={labels.rule.value.text.validation.required}
      value={value}
      inputProps={{
        autoComplete: "off",
      }}
      onChange={(t, v) => {
        dispatchAction({
          type: "set-value",
          id,
          value: v,
        });
      }}
      onBlur={() => {
        setTouched(true);
      }}
      onKeyDown={(e: any) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      placeholder="—"
      readOnly={readOnly}
    />
  );
};
