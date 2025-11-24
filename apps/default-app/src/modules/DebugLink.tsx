import { NavLink } from "react-router-dom";
import { HvIconButton } from "@hitachivantara/uikit-react-core";
import { Debug } from "@hitachivantara/uikit-react-icons";

export default function DebugLink() {
  if (import.meta.env.PROD) return null;

  return (
    <HvIconButton component={NavLink} to="/debug" title="Debug Page">
      <Debug />
    </HvIconButton>
  );
}
