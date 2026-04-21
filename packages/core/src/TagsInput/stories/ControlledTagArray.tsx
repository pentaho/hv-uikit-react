import { useState } from "react";
import {
  HvButton,
  HvTagsInput,
  HvTypography,
  type HvTagProps,
} from "@hitachivantara/uikit-react-core";

export const ControlledTagArray = () => {
  const [currValueArr, setCurrValueArr] = useState<HvTagProps[]>([
    { label: "tag 1", color: "#7ed69e" },
    {
      label: "tag 2 - click me!",
      color: "#7eccd6",
      type: "categorical",
      onClick: () => alert("Hello"),
    },
    { label: "tag 3", color: "#eba000" },
  ]);

  return (
    <>
      <div className="flex gap-xs mb-sm">
        <HvButton
          variant="secondarySubtle"
          onClick={() => {
            const newArray = [...currValueArr];
            newArray.push({
              label: `tag ${currValueArr.length + 1}`,
              type: currValueArr.length % 2 === 0 ? "categorical" : "semantic",
              color: currValueArr.length % 2 === 0 ? "#7eccd6" : "#eba000",
            });
            setCurrValueArr(newArray);
          }}
        >
          Add tags
        </HvButton>
        <HvButton variant="secondarySubtle" onClick={() => setCurrValueArr([])}>
          Clear tags
        </HvButton>
      </div>
      <HvTagsInput
        label="Controlled with array of tags"
        aria-label="Controlled with array of tags"
        placeholder="Enter value"
        value={currValueArr}
        onChange={(event, value) => {
          setCurrValueArr(value);
        }}
      />
      <HvTypography variant="label">Current value:</HvTypography>
      <HvTypography>{JSON.stringify(currValueArr)}</HvTypography>
    </>
  );
};
