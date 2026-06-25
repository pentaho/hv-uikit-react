import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import { getAppTitle } from "../vite-plugin-generate-base";

describe("test vite-generate-base plugin", () => {
  describe("test `getAppTitle` method", () => {
    test.each<[boolean, HvAppShellConfig, string]>([
      [false, { name: "dummyName" }, "dummyName"],
      [true, {}, "%%APPSHELL_TITLE%%"],
    ])("At mode %b, %j,  app title matches %s", (value, config, expected) => {
      expect(getAppTitle(value, config)).toBe(expected);
    });
  });
});
