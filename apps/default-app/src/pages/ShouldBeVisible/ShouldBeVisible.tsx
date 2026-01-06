import { FC } from "react";
import { HvContainer, HvTypography } from "@hitachivantara/uikit-react-core";

const ShouldBeVisible: FC = () => {
  return (
    <HvContainer maxWidth="lg">
      <HvTypography variant="title1" style={{ marginBottom: "32px" }}>
        This page is being correctly rendered!
      </HvTypography>
    </HvContainer>
  );
};

export default ShouldBeVisible;
