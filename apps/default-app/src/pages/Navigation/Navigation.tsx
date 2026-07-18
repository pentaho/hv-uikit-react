/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { Link } from "react-router-dom";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import {
  HvGlobalActions,
  HvGrid,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const Navigation = () => {
  const { getViewRoute } = useHvNavigation();

  const internalNavigation =
    getViewRoute({
      viewBundle: "/pages/Details",
      pathParams: {
        cardId: "10",
        cardText: "Dummy text",
      },
    }) ?? "";

  const scopedNavigation =
    getViewRoute({
      viewBundle: "@hv/sample-app/pages/Home",
      search: "?mode=light",
    }) ?? "";

  const nonScopedNavigation =
    getViewRoute({
      viewBundle: "@hv/sample-app/pages/Home",
      search: "?mode=dark",
    }) ?? "";

  return (
    <>
      <HvGlobalActions title="Navigation" className="mb-xs" />

      <HvGrid container className="mb-xs">
        <HvGrid item xs={12} display="flex">
          <HvTypography variant="label">
            For the correct usage of this page, it is required that simple app
            is available.
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={12} display="flex">
          <HvTypography link component={Link} to={internalNavigation}>
            Detail: Internal Navigation (/pages/Details)
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={12} display="flex">
          <HvTypography link component={Link} to={scopedNavigation}>
            Light Mode: Scoped bundle navigation (@hv/sample-app/pages/Home)
          </HvTypography>
        </HvGrid>
        <HvGrid item xs={12} display="flex">
          <HvTypography link component={Link} to={nonScopedNavigation}>
            Dark Mode: Non scoped bundle navigation (@hv/sample-app/pages/Home)
          </HvTypography>
        </HvGrid>
      </HvGrid>
    </>
  );
};

export default Navigation;
