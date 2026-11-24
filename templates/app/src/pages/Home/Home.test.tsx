import { render, screen } from "@testing-library/react";

import Home from ".";
import { TestProvider } from "../../tests/providers";

describe("<Home />", () => {
  it("names the app and says where to build", async () => {
    render(
      <TestProvider>
        <Home />
      </TestProvider>,
    );

    expect(
      await screen.findByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("src/pages/Home/index.tsx")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /UI Kit docs/ })).toHaveAttribute(
      "href",
      "https://pentaho.github.io/uikit-docs/master/",
    );
  });
});
