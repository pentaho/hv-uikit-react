import { useState } from "react";
import {
  HvSection,
  HvSwitch,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const settings = [
  {
    id: "email",
    label: "Email notifications",
    description: "Receive updates and alerts by email",
    defaultChecked: true,
  },
  {
    id: "push",
    label: "Push notifications",
    description: "Receive real-time push alerts",
    defaultChecked: false,
  },
  {
    id: "sms",
    label: "SMS notifications",
    description: "Receive text messages for critical events",
    defaultChecked: false,
  },
  {
    id: "weekly",
    label: "Weekly digest",
    description: "Get a summary report every Monday",
    defaultChecked: true,
  },
];

export default function Demo() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(settings.map((s) => [s.id, s.defaultChecked])),
  );

  return (
    <HvSection
      title={
        <HvTypography variant="title4">Notification Preferences</HvTypography>
      }
      className="max-w-sm w-full"
    >
      <div className="flex flex-col gap-sm">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between gap-md"
          >
            <div>
              <HvTypography variant="label">{setting.label}</HvTypography>
              <HvTypography variant="caption1" className="color-textSubtle">
                {setting.description}
              </HvTypography>
            </div>
            <HvSwitch
              aria-label={setting.label}
              checked={values[setting.id]}
              onChange={(_, checked) =>
                setValues((prev) => ({ ...prev, [setting.id]: checked }))
              }
            />
          </div>
        ))}
      </div>
    </HvSection>
  );
}
