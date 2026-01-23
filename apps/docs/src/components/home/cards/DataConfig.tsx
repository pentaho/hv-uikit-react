import {
  HvBannerContent,
  HvButton,
  HvCheckBox,
  HvDropdown,
  HvInput,
} from "@hitachivantara/uikit-react-core";

import { Card } from "./Card";

const backupOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

export const DataConfig = () => {
  return (
    <Card title="Data Management Configuration">
      <div className="grid gap-sm">
        <HvBannerContent
          showIcon
          variant="info"
          action={null}
          className="min-w-unset w-full"
        >
          Backup impacts storage.
        </HvBannerContent>
        <HvInput
          label="Storage Limit (in GB)"
          placeholder="Enter storage limit"
          inputProps={{
            type: "number",
            min: 0,
            step: 10,
            "aria-label": "storage-limit",
          }}
        />
        <HvDropdown
          label="Backup Frequency"
          values={backupOptions}
          placeholder="Select backup frequency"
          aria-label="backup-frequency"
        />
        <HvCheckBox
          label="Enable Automatic Data Cleanup"
          labelProps={{ className: "text-wrap" }}
          className="overflow-auto"
        />
        <div className="flex justify-end gap-xs">
          <HvButton variant="primary" aria-label="save-config-button">
            Save
          </HvButton>
        </div>
      </div>
    </Card>
  );
};
