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
import { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router";

import { Container } from "../../components/Container";
import { Header } from "../../components/Header";
import { NavigationProvider } from "../../context/navigation";

const useRootRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const dashboard = searchParams.get("dashboard");
    if (dashboard != null) {
      navigate(`/dashboard-preview?id=${dashboard}`, { replace: true });
    }
  }, [searchParams, navigate]);
};

/** Navigation layout & provider */
const Navigation = () => {
  useRootRedirect();

  return (
    <div className="bg-default w-full">
      <NavigationProvider>
        <Header />
        <Container maxWidth="xl" component="main">
          <Outlet />
        </Container>
      </NavigationProvider>
    </div>
  );
};

/** Navigation + Theme Generator layout & providers */
export const Component = () => (
  <div className="flex flex-row rounded-circle">
    <div className="flex-1 overflow-y-auto">
      <Navigation />
    </div>
  </div>
);
