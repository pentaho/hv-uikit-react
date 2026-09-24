import { useState } from "react";
import {
  HvInput,
  HvSelect,
  HvOption,
  HvButton,
} from "@pentaho/uikit-react-core";

export interface SettingsPanelValues {
  name: string;
  priority: string;
}

export interface SettingsPanelProps {
  /** Called when the user confirms the changes. */
  onSave?: (values: SettingsPanelValues) => void;
  /** Called when the user discards the changes. */
  onCancel?: () => void;
}

/**
 * A small settings panel with a labelled text field, a priority dropdown
 * and Save / Cancel actions.
 */
export function SettingsPanel({ onSave, onCancel }: SettingsPanelProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("medium");

  const handleSave = () => {
    onSave?.({ name, priority });
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm">
      <HvInput
        name="settingName"
        label="Name"
        placeholder="Enter a name"
        value={name}
        onChange={(_event, value) => setName(value)}
        required
      />

      <HvSelect
        label="Priority"
        value={priority}
        onChange={(_event, value) => setPriority(value as string)}
      >
        <HvOption value="low">Low</HvOption>
        <HvOption value="medium">Medium</HvOption>
        <HvOption value="high">High</HvOption>
      </HvSelect>

      <div className="flex gap-2 justify-end">
        <HvButton variant="secondarySubtle" onClick={onCancel}>
          Cancel
        </HvButton>
        <HvButton variant="primary" onClick={handleSave}>
          Save
        </HvButton>
      </div>
    </div>
  );
}

export default SettingsPanel;
