import {
  HvIconContainer,
  HvStatusIcon,
  HvStatusIconVariant,
  HvTag,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { Card } from "./Card";

const securityData = [
  { title: "Critical", count: 5, color: "negative" },
  { title: "Warning", count: 12, color: "warning" },
  { title: "Informational", count: 20, color: "info" },
];

const iconMap: Record<string, HvStatusIconVariant> = {
  negative: "error",
  warning: "warning",
  info: "info",
};

export const DataSecurity = () => {
  return (
    <Card
      title="Data Security Overview"
      subtitle="Incidents from the last 30 days."
      icon={
        <HvIconContainer color="primary">
          <div className="i-ph-presentation-chart" />
        </HvIconContainer>
      }
    >
      <div className="flex gap-xs justify-between">
        {securityData.map(({ title, count, color }) => (
          <div key={title}>
            <HvTypography variant="captionLabel" className="mb-xs">
              {title}
            </HvTypography>
            <HvTag
              icon={<HvStatusIcon type="simple" variant={iconMap[color]} />}
              label={count.toString()}
              color={color}
              // className="w-48px"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
