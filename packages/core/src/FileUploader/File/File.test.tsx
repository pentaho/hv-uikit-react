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
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvFile, type HvFileData, type HvFileProps } from "./File";

const dataFail: HvFileData = {
  name: "somefile.png",
  size: 875,
  errorMessage: "File type not allowed for upload",
  progress: 25,
  status: "fail",
} as HvFileData;

const dataSuccess: HvFileData = {
  name: "somefile.png",
  size: 875,
  errorMessage: "File type not allowed for upload",
  progress: 25,
  status: "success",
} as HvFileData;

const Main = (props: HvFileProps) => (
  <HvFile
    onFileRemoved={() => {}}
    removeFileButtonLabel="removeFileButtonLabel"
    {...props}
  />
);

describe("File", () => {
  it("should render correctly success status", () => {
    render(<Main data={dataSuccess} />);

    expect(screen.getByRole("listitem")).toBeVisible();
  });

  it("should render correctly fail status", () => {
    render(<Main data={dataFail} />);

    expect(screen.getByRole("listitem")).toBeVisible();
  });

  it("should call the delete file callback", async () => {
    const onClickMock = vi.fn();

    const { getByRole } = render(
      <Main data={dataSuccess} onFileRemoved={onClickMock} />,
    );

    const fileButton = getByRole("button");

    await userEvent.click(fileButton);

    expect(onClickMock).toHaveBeenCalled();
  });
});
