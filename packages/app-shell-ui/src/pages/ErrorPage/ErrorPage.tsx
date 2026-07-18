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
import {
  createClasses,
  HvContainer,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";

import { useNavigationContext } from "../../providers/NavigationProvider";
import { Footer } from "./Footer";

const { useClasses } = createClasses("ErrorPage", {
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.space.lg,
    paddingBottom: theme.space.lg,
    textAlign: "center",
    "& > svg": {
      flex: 1,
    },
  },
});

type ErrorPageProps = {
  code?: string;
  title: string;
  /* image component */
  image?: React.ReactNode;
  includeFooter?: boolean;
};

export const ErrorPage = ({
  code,
  title,
  image,
  includeFooter = true,
}: ErrorPageProps) => {
  const { classes } = useClasses();
  const { isCompactMode } = useNavigationContext();

  return (
    <HvContainer maxWidth="xl" className={classes.root}>
      {code && <HvTypography variant="title1">{code}</HvTypography>}
      <HvTypography variant={isCompactMode ? "title3" : "display"}>
        {title}
      </HvTypography>
      {image}
      {includeFooter && <Footer />}
    </HvContainer>
  );
};
