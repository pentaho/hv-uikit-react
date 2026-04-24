import { screen } from "@testing-library/react";

import renderTestProvider from "../../../tests/testUtils";
import { BrandLogo } from "./BrandLogo";

describe("BrandLogo", () => {
  it("should render the default if no logo is provided", async () => {
    await renderTestProvider(<BrandLogo />);
    expect(await screen.findByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("should render the default when empty logo prop", async () => {
    await renderTestProvider(<BrandLogo logo={{}} />);
    expect(await screen.findByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("shouldn't render any logo when logo prop is null", async () => {
    await renderTestProvider(<BrandLogo logo={null} />);

    // BrandLogo returns null — verify no logo SVGs are rendered.
    // Wait for the other tests' logos to NOT appear (they render above via findBy).
    expect(screen.queryByLabelText("Pentaho logo")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Lumada logo")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Hitachi logo")).not.toBeInTheDocument();
  });

  it("should render the Lumada logo when provided", async () => {
    await renderTestProvider(<BrandLogo logo={{ name: "LUMADA" }} />);
    expect(await screen.findByLabelText("Lumada logo")).toBeInTheDocument();
  });

  it("should render the Hitachi logo when provided", async () => {
    await renderTestProvider(<BrandLogo logo={{ name: "HITACHI" }} />);
    expect(await screen.findByLabelText("Hitachi logo")).toBeInTheDocument();
  });

  it("should render the Pentaho logo when provided", async () => {
    await renderTestProvider(<BrandLogo logo={{ name: "PENTAHO" }} />);
    expect(await screen.findByLabelText("Pentaho logo")).toBeInTheDocument();
  });

  it("should have description with value (string without translation)", async () => {
    await renderTestProvider(
      <BrandLogo
        logo={{ name: "HITACHI", description: "Test logo description" }}
      />,
    );
    expect(
      await screen.findByLabelText("Test logo description"),
    ).toBeInTheDocument();
  });

  it("should have description with translated value (string with translation)", async () => {
    await renderTestProvider(
      <BrandLogo logo={{ name: "LUMADA", description: "logoDesc" }} />,
      undefined,
      { en: { logoDesc: "Translated logo description" } },
    );

    expect(
      await screen.findByLabelText("Translated logo description"),
    ).toBeInTheDocument();
  });

  it("should have logo default description (explicit null or prop not present)", async () => {
    await renderTestProvider(<BrandLogo logo={{ name: "PENTAHO" }} />);
    expect(await screen.findByLabelText("Pentaho logo")).toBeInTheDocument();
  });
});
