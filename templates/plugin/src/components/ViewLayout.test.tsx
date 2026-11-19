import { render, screen } from "@testing-library/react";
import { HvProvider } from "@pentaho/uikit-react-core";

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
});
