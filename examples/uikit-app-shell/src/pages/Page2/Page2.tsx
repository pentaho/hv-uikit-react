import { Link } from "react-router-dom";
import { HvTypography } from "@pentaho/uikit-react-core";

export default function Page2() {
  return (
    <>
      <HvTypography variant="title2">Page 2</HvTypography>
      <HvTypography link component={Link} to="/">
        Go back
      </HvTypography>
    </>
  );
}
