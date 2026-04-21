import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { HvFileData } from "../File";
import { HvFileList } from "./FileList";

const Main = () => (
  <HvFileList
    list={
      [
        {
          id: "1",
          errorMessage: "File type not allowed for upload",
          status: "fail",
          name: "Screenshot 2019-12-05 at 17.15.43.png",
          size: 14106,
        },
        {
          id: "2",
          errorMessage: "File type not allowed for upload",
          status: "fail",
          name: "Screenshot 2019-12-05 at 12.03.13.png",
          size: 875,
        },
      ] as HvFileData[]
    }
    removeFileButtonLabel="removeFileButtonLabel"
    onFileRemoved={() => {}}
  />
);

describe("FileList", () => {
  it("should render the list with items", () => {
    render(<Main />);

    const lists = screen.queryAllByRole("listitem");
    expect(lists.length).toBe(2);
  });
});
