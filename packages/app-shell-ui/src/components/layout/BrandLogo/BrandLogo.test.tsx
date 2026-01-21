import { render, screen } from "@testing-library/react";
import { HvProvider } from "@hitachivantara/uikit-react-core";

import renderTestProvider from "../../../tests/testUtils";
import BrandLogo from "./BrandLogo";

describe("BrandLogo", () => {
  it("should render the default if no logo is provided", () => {
    render(
      <HvProvider>
        <BrandLogo />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("should render the default when empty logo prop", () => {
    render(
      <HvProvider>
        <BrandLogo logo={{}} />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("shouldn't render any logo when logo prop is null", () => {
    const { queryByLabelText } = render(
      <HvProvider>
        <BrandLogo logo={null} />
      </HvProvider>,
    );

    expect(queryByLabelText("Pentaho logo")).toBeNull();
    expect(queryByLabelText("Lumada logo")).toBeNull();
    expect(queryByLabelText("Hitachi logo")).toBeNull();
  });

  it("should render the Lumada logo when provided", () => {
    render(
      <HvProvider>
        <BrandLogo logo={{ name: "LUMADA" }} />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Lumada logo")).toBeInTheDocument();
  });

  it("should render the Hitachi logo when provided", () => {
    render(
      <HvProvider>
        <BrandLogo logo={{ name: "HITACHI" }} />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("should render the Pentaho logo when provided", () => {
    render(
      <HvProvider>
        <BrandLogo logo={{ name: "PENTAHO" }} />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Pentaho logo")).toBeInTheDocument();
  });

  it("should have description with value (string without translation)", () => {
    render(
      <HvProvider>
        <BrandLogo
          logo={{
            name: "HITACHI",
            description: "Test logo description",
          }}
        />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Test logo description")).toBeInTheDocument();
  });

  it("should have description with translated value (string with translation)", async () => {
    renderTestProvider(
      <BrandLogo logo={{ name: "LUMADA", description: "logoDesc" }} />,
      undefined,
      {
        en: {
          logoDesc: "Translated logo description",
        },
      },
    );

    expect(
      await screen.findByLabelText("Translated logo description"),
    ).toBeInTheDocument();
  });

  it("should have logo default description (explicit null or prop not present)", () => {
    render(
      <HvProvider>
        <BrandLogo logo={{ name: "PENTAHO" }} />
      </HvProvider>,
    );

    expect(screen.getByLabelText("Pentaho logo")).toBeInTheDocument();
  });
});
