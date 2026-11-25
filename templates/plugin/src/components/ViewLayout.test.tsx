import { render, screen } from "@testing-library/react";
import { HvButton, HvProvider } from "@pentaho/uikit-react-core";

import { ViewLayout } from "./ViewLayout";

describe("<ViewLayout />", () => {
  it("opens with the view's title as its heading", () => {
    render(
      <HvProvider>
        <ViewLayout title="Jobs">{null}</ViewLayout>
      </HvProvider>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Jobs" }),
    ).toBeInTheDocument();
  });

  it("shows the view's primary action beside the title", () => {
    render(
      <HvProvider>
        <ViewLayout title="Jobs" actions={<HvButton>New job</HvButton>}>
          {null}
        </ViewLayout>
      </HvProvider>,
    );

    expect(screen.getByRole("button", { name: "New job" })).toBeInTheDocument();
  });
});
