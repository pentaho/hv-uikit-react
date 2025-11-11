import { useContext } from "react";
import {
  HvContainer,
  HvPanel,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { DefaultAppContext } from "../../providers/DefaultAppProvider";
import { useAsyncContext } from "../../providers/shared/useAsyncContext";
import { useDynamicContext } from "../../providers/shared/useDynamicContext";
import { useHiddenContext } from "../../providers/shared/useHiddenContext";

const ProvidersDemo = () => {
  const defaultAppContext = useContext(DefaultAppContext);
  const asyncContext = useAsyncContext();
  const hiddenContext = useHiddenContext();
  const dynamicContext = useDynamicContext();

  return (
    <HvContainer>
      <HvTypography variant="title1">Providers Conditions Demo</HvTypography>
      <HvTypography
        variant="body"
        style={{ marginTop: "16px", marginBottom: "24px" }}
      >
        This page demonstrates how providers can be conditionally loaded based
        on visibility conditions.
      </HvTypography>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <HvPanel>
          <HvTypography variant="title3">
            DefaultAppProvider (No conditions - Always available)
          </HvTypography>
          <HvTypography variant="body">
            Message: {defaultAppContext?.text || "Not available"}
          </HvTypography>
        </HvPanel>

        <HvPanel>
          <HvTypography variant="title3">
            AsyncProvider (Delayed 0.5 seconds)
          </HvTypography>
          <HvTypography variant="body">
            Message: {asyncContext?.message}
          </HvTypography>
        </HvPanel>

        <HvPanel>
          <HvTypography variant="title3">
            HiddenProvider (Never loaded!)
          </HvTypography>
          <HvTypography variant="body">
            Message: {hiddenContext?.message}
          </HvTypography>
        </HvPanel>

        <HvPanel>
          <HvTypography variant="title3">
            DynamicProvider ([Simulation] Authorization given after 10 seconds)
          </HvTypography>
          <HvTypography variant="body">
            Message:{" "}
            {dynamicContext?.message ||
              "No default value, waiting for condition flip. This should change after 10 seconds!"}
          </HvTypography>
        </HvPanel>
      </div>
    </HvContainer>
  );
};

export default ProvidersDemo;
