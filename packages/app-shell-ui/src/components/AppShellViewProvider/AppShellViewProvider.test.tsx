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
import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { HvAppShellViewContext } from "@hitachivantara/app-shell-shared";

import AppShellViewProvider from "./AppShellViewProvider";

describe("AppShellViewProvider component", () => {
  const DummyComponent = () => {
    const test = useContext(HvAppShellViewContext);
    return <p>{test?.id}</p>;
  };

  render(
    <AppShellViewProvider id="dummy-id">
      <DummyComponent />
    </AppShellViewProvider>,
  );

  it("should pass its context value to children", () => {
    expect(screen.queryByText("dummy-id")).toBeInTheDocument();
  });
});
