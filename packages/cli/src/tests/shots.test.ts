import { describe, expect, it } from "vitest";

import { shotsProblems } from "../shots";

describe("uikit-cli shots", () => {
  it("accepts shots of local pages with known steps", () => {
    expect(
      shotsProblems([
        {
          name: "01-list",
          url: "http://localhost:5173/jobs",
          steps: [
            { click: { role: "button", name: "Retry", in: "dialog" } },
            { wait: 500 },
          ],
        },
      ]),
    ).toEqual([]);
  });

  it("names each problem: a file name, a page elsewhere, an unknown or empty step", () => {
    expect(
      shotsProblems([
        {
          name: "01 list/x",
          url: "https://example.com",
          steps: [{ hover: "x" }, null],
        },
      ]),
    ).toEqual([
      "shot 1: a file-safe name, like 01-list",
      "shot 1: a url on this machine, like http://localhost:5173/<route>",
      'shot 1: unknown step {"hover":"x"}',
      "shot 1: unknown step null",
    ]);
    expect(shotsProblems({})).toEqual(["a list of shots is expected"]);
  });
});
