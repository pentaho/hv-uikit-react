/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { render, screen } from "@testing-library/react";

import { HvDropZone } from "./DropZone";

describe("DropZone", () => {
  it("should render drop zone input and labels", () => {
    render(
      <HvDropZone
        label="Label"
        accept=".jpg"
        maxFileSize={1}
        labels={{
          sizeWarning: "Max. file size:",
          drag: "Drag and drop or",
          selectFiles: "Select files",
          dropFiles: "Drop files here",
          fileSizeError: "The file exceeds the maximum upload size",
          fileTypeError: "File type not allowed for upload",
        }}
      />,
    );

    expect(screen.getByText("Label", { selector: "label" })).toBeVisible();
    expect(
      screen.getByText("Max. file size: 1.00B (.jpg)", { selector: "label" }),
    ).toBeVisible();
    expect(screen.getByText("Drag and drop or")).toBeVisible();
    expect(screen.getByText("Select files")).toBeVisible();
    expect(
      screen.getByLabelText("Label", { selector: "input" }),
    ).toBeInTheDocument();
  });
});
