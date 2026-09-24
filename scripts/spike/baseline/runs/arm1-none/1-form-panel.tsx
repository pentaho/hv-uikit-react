import { useState } from "react";
import {
  HvPanel,
  HvTypography,
  HvTextField,
  HvSelect,
  HvOption,
  HvButton,
} from "@hitachivantara/uikit-react-core";

export interface SettingsPanelValues {
  name: string;
  priority: string;
}

export interface SettingsPanelProps {
  /** Called when the user confirms the form. */
  onSave?: (values: SettingsPanelValues) => void;
  /** Called when the user discards their changes. */
  onCancel?: () => void;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function SettingsPanel({ onSave, onCancel }: SettingsPanelProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState<string>("medium");

  const handleSave = () => {
    onSave?.({ name, priority });
  };

  return (
    <HvPanel style={{ maxWidth: 420, padding: 24 }}>
      <HvTypography variant="title3" style={{ marginBottom: 24 }}>
        Settings
      </HvTypography>

      <HvTextField
        label="Name"
        placeholder="Enter a name"
        value={name}
        onChange={(_evt, value) => setName(value)}
        style={{ marginBottom: 16 }}
      />

      <HvSelect
        label="Priority"
        value={priority}
        onChange={(value) => setPriority(value as string)}
        style={{ marginBottom: 32 }}
      >
        {priorityOptions.map((option) => (
          <HvOption key={option.value} value={option.value}>
            {option.label}
          </HvOption>
        ))}
      </HvSelect>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <HvButton variant="secondaryGhost" onClick={onCancel}>
          Cancel
        </HvButton>
        <HvButton variant="primary" onClick={handleSave}>
          Save
        </HvButton>
      </div>
    </HvPanel>
  );
}

export default SettingsPanel;
