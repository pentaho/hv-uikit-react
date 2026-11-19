import { render, screen } from "@testing-library/react";

import Example from ".";
import { TestProvider } from "../../tests/providers";

describe("<Example />", () => {
  it("welcomes the user and lists the first steps", async () => {
    render(
      <TestProvider>
        <Example />
      </TestProvider>,
    );

    expect(
      await screen.findByRole("heading", { level: 1, name: "Welcome" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(
      screen.getByRole("link", { name: /Read the UI Kit docs/ }),
    ).toHaveAttribute("href", "https://pentaho.github.io/uikit-docs/master/");
  });
});
