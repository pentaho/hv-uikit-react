import { RocketLaunchIcon } from "@phosphor-icons/react/RocketLaunch";
import { HvTypography } from "@hitachivantara/uikit-react-core";

import type { BasicNotification } from "../types";

const NotificationComponent: BasicNotification = ({ message, variant }) => {
  return (
    <>
      <RocketLaunchIcon />
      <HvTypography variant={variant} style={{ marginBottom: "16px" }}>
        {message}
      </HvTypography>
    </>
  );
};

export default NotificationComponent;
