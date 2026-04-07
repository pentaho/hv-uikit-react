import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvTypography,
  type HvCardProps,
} from "@hitachivantara/uikit-react-core";
import { Level2Average } from "@hitachivantara/uikit-react-icons";

export const Main = (props: HvCardProps) => (
  <HvCard style={{ width: 360 }} {...props}>
    <HvCardHeader
      title="Asset Avatar L90"
      subheader="Compressor"
      icon={<Level2Average color={props?.statusColor} />}
    />
    <HvCardMedia
      component="img"
      alt="Compressor"
      height={140}
      image="https://i.imgur.com/bxPPTD3.png"
    />
    <HvCardContent>
      <div style={{ paddingTop: "20px" }}>
        <HvTypography variant="label">ID</HvTypography>
        <HvTypography>2101cad3-7cd4-1000-bdp95-d8c497176e7c</HvTypography>
      </div>
      <div style={{ marginTop: "20px" }}>
        <HvTypography variant="label">Last connected</HvTypography>
        <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
      </div>
    </HvCardContent>
  </HvCard>
);
