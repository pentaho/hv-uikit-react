import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HvTypography, HvTypographyProps } from "./Typography";

interface CustomLinkProps extends HvTypographyProps<"a"> {
  to: string;
}

const CustomLink = ({ to, children, ...others }: CustomLinkProps) => (
  <a href={to} {...others}>
    {children}
  </a>
);

describe("Typography", () => {
  it("renders text children", () => {
    render(<HvTypography>TEXT</HvTypography>);

    const text = screen.getByText("TEXT");

    expect(text).toBeInTheDocument();
  });

  it("renders node children", () => {
    render(
      <HvTypography>
        <button type="button">TEXT</button>
      </HvTypography>,
    );

    const button = screen.getByRole("button", { name: "TEXT" });

    expect(button).toBeInTheDocument();
  });

  it(`renders custom variant`, () => {
    render(<HvTypography variant="title3">TEXT</HvTypography>);

    const text = screen.getByText("TEXT");

    expect(text).toBeInTheDocument();
    expect(text).toHaveAttribute("data-variant", "title3");
  });

  it("renders polymorphic link", () => {
    render(
      <HvTypography component="a" href="/path/to">
        TEXT
      </HvTypography>,
    );

    const link = screen.getByRole("link", { name: "TEXT" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/path/to");
  });

  it("renders polymorphic custom link", () => {
    render(
      <HvTypography component={CustomLink} to="/path/to">
        TEXT
      </HvTypography>,
    );

    const link = screen.getByRole("link", { name: "TEXT" });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/path/to");
  });
});
