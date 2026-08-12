import {
  HvIconContainer,
  HvTag,
  HvTypography,
} from "@pentaho/uikit-react-core";

import { Card } from "./Card";

const securityData = [
  { title: "Critical", count: 5, color: "negative" },
  { title: "Warning", count: 12, color: "warning" },
  { title: "Informational", count: 20, color: "info" },
];

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
            <HvTag label={count.toString()} color={color} className="w-48px" />
          </div>
        ))}
      </div>
    </Card>
  );
};
