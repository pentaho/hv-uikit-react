import { useContext } from "react";
import { HvIconButton } from "@pentaho/uikit-react-core";
import { HazyDay } from "@pentaho/uikit-react-icons";

import { DefaultAppContext } from "../../providers/DefaultAppProvider";

export default function ChangeContextValue() {
  const { setText } = useContext(DefaultAppContext);

  return (
    <HvIconButton
      variant="secondaryGhost"
      title="Change default-app context value from default-app"
      onClick={() => {
        setText("Change default-app context value from default-app");
      }}
    >
      <HazyDay />
    </HvIconButton>
  );
}
