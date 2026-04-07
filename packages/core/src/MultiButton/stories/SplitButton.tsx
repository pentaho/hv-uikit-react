import { useMemo, useState } from "react";
import {
  HvButton,
  HvDropDownMenu,
  HvMultiButton,
  type HvMultiButtonProps,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS } from "@hitachivantara/uikit-react-icons";

const buttons = [
  { variant: "primary" },
  { variant: "primarySubtle", size: "sm" },
  { variant: "secondarySubtle", size: "sm" },
  { variant: "secondarySubtle", size: "lg" },
  { variant: "primary", size: "lg", disabled: true },
] satisfies Pick<HvMultiButtonProps, "variant" | "size" | "disabled">[];

export const SplitButton = () => {
  const options = useMemo(
    () => [
      { label: "Create merge commit" },
      { label: "Squash and merge" },
      { label: "Rebase and merge" },
    ],
    [],
  );
  const [selectedOption, setSelectedOption] = useState(options[0]);

  return (
    <div className="flex gap-xs">
      {buttons.map(({ variant, size, disabled }, i) => (
        <HvMultiButton
          key={`${variant}-${size}-${disabled}`}
          variant={variant}
          size={size}
          disabled={disabled}
          split
        >
          {i % 2 === 0 && <HvButton>{selectedOption.label}</HvButton>}
          <HvDropDownMenu
            dataList={options}
            icon={<DropDownXS />}
            onClick={(e, item) =>
              setSelectedOption(
                options.find((option) => option.label === item.label)!,
              )
            }
          />
          {i % 2 !== 0 && <HvButton>{selectedOption.label}</HvButton>}
        </HvMultiButton>
      ))}
    </div>
  );
};
