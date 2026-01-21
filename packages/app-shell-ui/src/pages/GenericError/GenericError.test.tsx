import { screen } from "@testing-library/dom";

import renderTestProvider from "../../tests/testUtils";
import GenericError from "./GenericError";

describe("`GenericError", () => {
  it("Should include textual and accessibility info", async () => {
    renderTestProvider(<GenericError />);

    const headings = await screen.findAllByRole("heading");
    expect(headings[0].textContent).toBe("500");
    expect(headings[1].textContent).toBe(
      "Shoot! We have a problem! Be back soon.",
    );
    expect(
      screen.getByRole("img", {
        name: "500 Generic error",
      }),
    ).toBeDefined();
  });
});
