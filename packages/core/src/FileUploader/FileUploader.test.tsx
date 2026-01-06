import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HvFileData } from "./File";
import { HvFileUploader, HvFileUploaderProps } from "./FileUploader";

const fileList = [
  { id: "1", name: "Screenshot1.png", size: 14100000, type: "image/png" },
  { id: "2", name: "Screenshot2.png", size: 875000, type: "image/png" },
] as HvFileData[];

const baseProps: HvFileUploaderProps = {
  fileList,
  accept: ".jpeg",
  maxFileSize: 12,
};

const Main = (props: HvFileUploaderProps) => (
  <HvFileUploader onFilesAdded={() => {}} onFileRemoved={() => {}} {...props} />
);

const FullSample = (props?: HvFileUploaderProps) => {
  const [files, setFiles] = useState(props?.fileList || []);

  return (
    <HvFileUploader
      fileList={files}
      accept=".png,.jpg"
      maxFileSize={12}
      onFilesAdded={(newFiles) => {
        setFiles((prev) => [...prev, ...newFiles]);
        props?.onFilesAdded?.(newFiles);
      }}
      onFileRemoved={(file) => {
        setFiles((prev) => prev.filter((f) => f !== file));
        props?.onFileRemoved?.(file);
      }}
      {...props}
    />
  );
};

describe("FileUploader", () => {
  it("should render the file list", () => {
    render(<Main {...baseProps} />);

    expect(screen.getByRole("list")).toBeVisible();
    expect(screen.queryAllByRole("listitem").length).toBe(2);
  });

  it("should render the dropzone", () => {
    render(<Main {...baseProps} />);

    const dropZone = screen.getByLabelText("Label", { selector: "input" });

    expect(dropZone).toBeInTheDocument();
  });

  it("should call file upload callback", () => {
    const onFilesAddedMock = vi.fn();

    render(<Main {...baseProps} onFilesAdded={onFilesAddedMock} />);

    const dropZone = screen.getByLabelText("Label", { selector: "input" });

    fireEvent.change(dropZone, {});

    expect(onFilesAddedMock).toHaveBeenCalled();
  });

  it("should add files on upload", async () => {
    const addMock = vi.fn();
    const rmMock = vi.fn();
    render(<FullSample onFilesAdded={addMock} onFileRemoved={rmMock} />);

    const dropZone = screen.getByLabelText("Label", { selector: "input" });
    const file1 = new File(["data"], "hello1.png", { type: "image/png" });
    const file2 = new File(["data"], "hello2.png", { type: "image/png" });

    await userEvent.upload(dropZone, file1);
    expect(addMock).toHaveBeenCalledTimes(1);

    await userEvent.upload(dropZone, file2);
    expect(addMock).toHaveBeenCalledTimes(2);
  });

  it("should display incorrect file type warning", () => {
    render(
      <Main
        {...baseProps}
        fileList={
          [
            {
              id: "3",
              status: "fail",
              errorMessage: "File type not allowed for upload",
              name: "somefile.jpeg",
              size: 141,
              type: "image/jpeg",
            },
          ] as HvFileData[]
        }
        accept=".png"
        maxFileSize={1}
      />,
    );

    const files = screen.queryAllByRole("listitem");

    expect(
      within(files[0]).getByText(/File type not allowed for upload/),
    ).toBeVisible();
  });

  it("should display incorrect file size warning", () => {
    render(
      <Main
        {...baseProps}
        fileList={
          [
            {
              id: "4",
              status: "fail",
              errorMessage: "The file exceeds the maximum upload size",
              name: "somefile.jpeg",
              size: 141,
              type: "image/jpeg",
            },
          ] as HvFileData[]
        }
        accept=".png"
        maxFileSize={5 * 1000}
      />,
    );

    const files = screen.queryAllByRole("listitem");

    expect(
      within(files[0]).getByText(/The file exceeds the maximum upload size/),
    ).toBeVisible();
  });
});
