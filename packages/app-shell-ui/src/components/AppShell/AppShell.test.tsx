import { useEffect, useState } from "react";
import { render, screen } from "@testing-library/react";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import AppShell from "./AppShell";

function useMenu(): HvAppShellConfig["menu"] {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return [];

  return [
    { target: "/home", label: "Home" },
    { target: "/options", label: "Options" },
  ];
}

function AppWithAsyncConfig() {
  const menu = useMenu();
  return <AppShell config={{ navigationMode: "ONLY_TOP", menu }} />;
}

describe("AppShell", () => {
  it("renders the Header when a minimum configuration is provided", async () => {
    render(<AppShell config={{}} />);
    expect(await screen.findByRole("banner")).toBeInTheDocument();
  });

  it("renders the navigation when a minimum configuration is provided", async () => {
    render(
      <AppShell
        config={{
          navigationMode: "ONLY_TOP",
          menu: [
            { target: "/home", label: "Home" },
            { target: "/options", label: "Options" },
          ],
        }}
      />,
    );

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Home" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Options" }),
    ).toBeInTheDocument();
  });

  it("renders correctly when configuration is loaded async", async () => {
    render(<AppWithAsyncConfig />);

    expect(await screen.findByRole("navigation")).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Home" }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Options" }),
    ).toBeInTheDocument();
  });
});
