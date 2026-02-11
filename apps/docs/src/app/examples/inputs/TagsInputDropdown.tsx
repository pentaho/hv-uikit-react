import { useEffect, useRef, useState } from "react";
import {
  HvAdornment,
  HvBaseDropdownPopper,
  HvTag,
  HvTagsInput,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS } from "@hitachivantara/uikit-react-icons";

const colors = [
  "Blue",
  "Red",
  "Green",
  "Yellow",
  "Purple",
  "White",
  "Black",
  "Orange",
  "Pink",
  "Brown",
  "Gray",
  "Cyan",
  "Magenta",
  "Lime",
  "Teal",
  "Lavender",
];

const lastUsed = ["Blue", "Red", "Green"];

export default function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollLeft = containerRef.current.scrollWidth;
    }
  }, [selectedColors]);

  const handleAddColor = (color: string) => {
    setSelectedColors((prev) => {
      const newColors = prev.filter((c) => c !== color);
      return newColors.length ? [...newColors, color] : [color];
    });
  };

  const handleRemoveColor = (color: string) => {
    setSelectedColors((prev) => prev.filter((c) => c !== color));
  };

  return (
    <div className="w-300px">
      <HvTagsInput
        label="TagsInput with Dropdown"
        placeholder="Enter tags or select from the dropdown..."
        ref={containerRef}
        onChange={(event, value) => {
          setSelectedColors(
            value.map((v) => (typeof v === "string" ? v : (v.label as string))),
          );
        }}
        onDelete={(_, value) => {
          handleRemoveColor(value as string);
        }}
        value={selectedColors}
        commitTagOn={["Comma", "Enter"]}
        endAdornment={
          <HvAdornment
            tabIndex={0}
            icon={<DropDownXS rotate={open} size="xs" />}
            onClick={() => setOpen((o) => !o)}
          />
        }
        classes={{
          tagsList: "h-32px pr-0! overflow-hidden",
        }}
      />
      <HvBaseDropdownPopper
        open={open}
        placement="bottom-start"
        anchorEl={containerRef.current}
        onClickAway={() => setOpen(false)}
        classes={{ panel: "grid gap-xs p-sm w-300px" }}
      >
        <HvTypography variant="caption1">Last Used:</HvTypography>
        <div className="flex gap-xs">
          {lastUsed.map((color, idx) => (
            <HvTag
              autoFocus={idx === 0}
              key={color}
              label={color}
              onClick={() => handleAddColor(color)}
            />
          ))}
        </div>
        <HvTypography variant="caption1">More colors:</HvTypography>
        <div className="flex flex-wrap gap-xs">
          {colors
            .filter(
              (color) =>
                !selectedColors.includes(color) && !lastUsed.includes(color),
            )
            .map((color) => (
              <HvTag
                key={color}
                label={color}
                onClick={() => handleAddColor(color)}
              />
            ))}
        </div>
      </HvBaseDropdownPopper>
    </div>
  );
}
