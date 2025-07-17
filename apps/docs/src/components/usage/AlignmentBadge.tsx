import { InfoIcon } from "@phosphor-icons/react/Info";
import { HvIconButton, HvTypography } from "@hitachivantara/uikit-react-core";

import { alignmentData } from "./alignmentData";

type AlignmentBadgeProps = {
  component: string;
};

export const AlignmentBadge = ({ component }: AlignmentBadgeProps) => {
  const values = alignmentData[component];

  if (!values) return null;

  const items = [
    ["Pentaho", values.pentahoPlus || "—"],
    ["NEXT v5", values.ds5 || "—"],
  ];

  return (
    <HvIconButton
      color="primary"
      title={
        <div className="flex flex-col gap-xs">
          <HvTypography variant="label">DS Alignment</HvTypography>
          <div className="border-b-3px border-bgPage my-xs -mx-sm" />
          {items.map(([name, value]) => (
            <div key={name} className="flex justify-between gap-xs">
              <HvTypography>{name}</HvTypography>
              <HvTypography>{value}</HvTypography>
            </div>
          ))}
        </div>
      }
    >
      <InfoIcon size={18} />
    </HvIconButton>
  );
};
