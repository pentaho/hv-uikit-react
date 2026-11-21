import { useState } from "react";
import { HvButton, HvMultiButton } from "@pentaho/uikit-react-core";
import { LocationPin, Map } from "@pentaho/uikit-react-icons";

const buttons = [
  { id: 1, name: "Map", icon: <Map /> },
  { id: 2, name: "Location", icon: <LocationPin /> },
  { id: 3, name: "Map", icon: <Map /> },
  { id: 4, name: "Location", icon: <LocationPin /> },
  { id: 5, name: "Map", icon: <Map /> },
  { id: 6, name: "Location", icon: <LocationPin /> },
];

export const VerticalOrientation = () => {
  const [selection, setSelection] = useState([0, 2, 3, 5]);

  const handleChange = (idx: number) => {
    const newSelection = selection.includes(idx)
      ? selection.filter((v) => v !== idx)
      : [...selection, idx];
    setSelection(newSelection);
  };

  return (
    <div style={{ display: "flex" }}>
      <HvMultiButton vertical style={{ width: "32px" }}>
        {buttons.map(({ id, name, icon }, i) => (
          <HvButton
            key={id}
            aria-label={name}
            selected={selection.includes(i)}
            onClick={() => handleChange(i)}
          >
            {icon}
          </HvButton>
        ))}
      </HvMultiButton>
      <HvMultiButton vertical style={{ marginLeft: "20px", width: "120px" }}>
        {buttons.map(({ id, name, icon }, i) => (
          <HvButton
            key={id}
            aria-label={name}
            startIcon={icon}
            selected={selection.includes(i)}
            onClick={() => handleChange(i)}
          >
            {name}
          </HvButton>
        ))}
      </HvMultiButton>
    </div>
  );
};
