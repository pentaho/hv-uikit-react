import { render } from "@testing-library/react";

import InternalAction from "./InternalAction";

describe("InternalAction Component", () => {
  it("should not render anything when the bundle doesn't have a match", () => {
    const { container } = render(<InternalAction bundle="dummy-bundle" />);

    expect(container).toBeEmptyDOMElement();
  });
});
