import { FC } from "react";
import { HvContainer, HvTypography } from "@hitachivantara/uikit-react-core";

const ShouldNotBeVisible: FC = () => {
  return (
    <HvContainer maxWidth="lg">
      <HvTypography variant="title1" style={{ marginBottom: "32px" }}>
        This page shouldn't be rendered!
      </HvTypography>
    </HvContainer>
  );
};

export default ShouldNotBeVisible;
