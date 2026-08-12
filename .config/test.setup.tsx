import { render } from "@testing-library/react";
import { beforeEach } from "vitest";
import { HvProvider } from "@pentaho/uikit-react-core";

import "@testing-library/jest-dom";

const customRender = (ui: React.ReactElement<any>, options = {}) =>
  render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => <HvProvider>{children}</HvProvider>,
    ...options,
  });

beforeEach(async (context: any) => {
  // extend context
  context.render = customRender;
});
