import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { HvAppShellViewContext } from "@pentaho/app-shell-shared";

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
