import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvDialog,
  HvDialogContent,
  HvDialogTitle,
  HvFileData,
  HvFileUploader,
  HvFileUploaderPreview,
  HvFileUploaderProps,
} from "@hitachivantara/uikit-react-core";
import { Code, DocWord } from "@hitachivantara/uikit-react-icons";

import { cancelUpload, simulateUpload } from "./stories/simulators";

const meta: Meta<typeof HvFileUploader> = {
  title: "Components/File Uploader",
  component: HvFileUploader,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvFileUploaderPreview },
};

export default meta;

export const Main: StoryObj<HvFileUploaderProps> = {
  args: { disabled: false },
  argTypes: {
    fileList: { control: { disable: true } },
    inputProps: { control: { disable: true } },
  },
  render: (args) => {
    const [list, setList] = useState<HvFileData[]>([]);

    const addFile = (file: HvFileData) => {
      const newFile = file;

      const hasFailed = file.status === "fail";

      if (!hasFailed) {
        newFile.status = "progress";
        newFile.progress = 0;

        simulateUpload(
          newFile,
          // onProgress:
          (progress) => {
            newFile.progress = progress;

            // The new state must always be a new list, so it must be cloned
            // otherwise the list elements changes wouldn't be detected
            setList((previousList) => [...previousList]);
          },
          // onComplete:
          () => {
            newFile.status = "success";

            setList((previousList) => [...previousList]);
          },
        );
      }

      // We're adding the new file to the top of the list
      // depending on the use case, we could also add to the bottom,
      // order them alphabetically, etc.
      setList((previousList) => [newFile, ...previousList]);
    };

    const removeFile = (fileToRemove: HvFileData) => {
      if (fileToRemove.status === "progress") {
        cancelUpload(fileToRemove);
      }

      // If the file was already upload to a server,
      // it might be necessary to call an API to delete it there

      setList((previousList) =>
        previousList.filter((file) => file !== fileToRemove),
      );
    };

    return (
      <HvFileUploader
        {...args}
        fileList={list}
        onFilesAdded={(newFiles) => {
          newFiles.forEach((newFile) => addFile(newFile));
        }}
        onFileRemoved={(removedFile) => {
          removeFile(removedFile);
        }}
      />
    );
  },
};

export const Basic: StoryObj<HvFileUploaderProps> = {
  parameters: {
    docs: {
      description: { story: "FileUploader default usage sample" },
    },
  },
  render: () => {
    const [list, setList] = useState<HvFileData[]>([]);

    const addFile = (file: HvFileData) => {
      const newFile = file;

      const hasFailed = file.status === "fail";

      if (!hasFailed) {
        newFile.status = "progress";
        newFile.progress = 0;

        simulateUpload(
          newFile,
          (progress) => {
            newFile.progress = progress;
            setList((previousList) => [...previousList]);
          },
          () => {
            newFile.status = "success";
            setList((previousList) => [...previousList]);
          },
        );
      }

      setList((previousList) => [newFile, ...previousList]);
    };

    const removeFile = (fileToRemove: HvFileData) => {
      if (fileToRemove.status === "progress") {
        cancelUpload(fileToRemove);
      }

      setList((previousList) =>
        previousList.filter((file) => file !== fileToRemove),
      );
    };

    return (
      <HvFileUploader
        accept=".jpg,.jpeg,.png"
        labels={{ sizeWarning: "Maximum file size:" }}
        maxFileSize={1 * 1000 ** 2}
        fileList={list}
        onFilesAdded={(newFiles) => {
          newFiles.forEach((newFile) => addFile(newFile));
        }}
        onFileRemoved={(removedFile) => {
          removeFile(removedFile);
        }}
      />
    );
  },
};

export const WithPreviewThumbnails: StoryObj<HvFileUploaderProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Each item can display a small preview of the uploaded file, like an image thumbnail or an icon representing the file type. " +
          "A bigger preview might be presented in a modal when clicking it.<br>" +
          "The preview can be any node/component. Accessibility must be addressed, e.g. by setting the thumbnail's `alt` property " +
          "and the button's `aria-label`.<br><br>" +
          "When displaying client side previews using `URL.createObjectURL()`, don't forget to clean them using `URL.revokeObjectURL()` " +
          "to avoid memory leaks. See [Using object URLs](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#using_object_urls).<br><br>" +
          "The `HvFileUploaderPreview` component is available to facilitate the styling of the button (when clickable) and the detection of image unloading.",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [previewTitle, setPreviewTitle] = useState<string>("");
    const [list, setList] = useState<HvFileData[]>([]);

    const openDialog = (url: string, title: string) => {
      setPreviewUrl(url);
      setPreviewTitle(title);
      setOpen(true);
    };

    // Note: Fixes an issue with Storybook where the screen will freeze if the state is already
    // initialized. Thus, we initialized it here in useEffect when the component mounts.
    useEffect(() => {
      setList([
        {
          id: "1",
          name: "already_here.jpg",
          size: 5000,
          status: "success",
          preview: (
            <HvFileUploaderPreview
              aria-label="Open the bigger preview"
              onClick={() =>
                openDialog(
                  "https://i.imgur.com/YcVYmM0.jpg",
                  "already_here.jpg",
                )
              }
            >
              <img
                alt="Small preview of the uploaded file"
                src="https://i.imgur.com/YcVYmM0.jpg"
              />
            </HvFileUploaderPreview>
          ),
        },
        {
          id: "2",
          name: "code.yaml",
          size: 200,
          status: "success",
          preview: <Code />,
        },
        {
          id: "3",
          name: "letter.docx",
          size: 2000,
          status: "success",
          preview: (
            <HvFileUploaderPreview
              aria-label="Open preview of the document (not!)"
              onClick={() => {}}
              disableOverlay
            >
              <DocWord />
            </HvFileUploaderPreview>
          ),
        },
      ] as HvFileData[]);
    }, []);

    const addFile = (file: HvFileData) => {
      const newFile = file;

      // See https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications#using_object_urls
      // specially to understand the need to explicitly call URL.revokeObjectURL() in Single Page Applications.
      const url = URL.createObjectURL(file as File);

      newFile.preview = (
        <HvFileUploaderPreview
          onClick={() => openDialog(url, file.name || "")}
          onUnload={() => {
            URL.revokeObjectURL(url);
          }}
          aria-label={`Open preview of ${file.name}`}
        >
          <img alt={`Thumbnail of ${file.name}`} src={url} />
        </HvFileUploaderPreview>
      );

      const hasFailed = file.status === "fail";

      if (!hasFailed) {
        newFile.status = "progress";
        newFile.progress = 0;

        simulateUpload(
          newFile,
          (progress) => {
            newFile.progress = progress;

            setList((previousList) => [...previousList]);
          },
          () => {
            newFile.status = "success";

            // The file preview could be set here instead
            // using a server side URL, for instance

            setList((previousList) => [...previousList]);
          },
        );
      }

      setList((previousList) => [newFile, ...previousList]);
    };

    const removeFile = (fileToRemove: HvFileData) => {
      if (fileToRemove.status === "progress") {
        cancelUpload(fileToRemove);
      }

      setList((previousList) =>
        previousList.filter((file) => file !== fileToRemove),
      );
    };

    return (
      <>
        <HvFileUploader
          accept="image/*"
          labels={{
            sizeWarning: "Maximum file size:",
            acceptedFiles: "Pick an image",
          }}
          fileList={list}
          onFilesAdded={(newFiles) => {
            newFiles.forEach((newFile) => addFile(newFile));
          }}
          onFileRemoved={(removedFile) => {
            removeFile(removedFile);
          }}
        />
        <HvDialog open={open} onClose={() => setOpen(false)}>
          <HvDialogTitle showIcon={false}>{previewTitle}</HvDialogTitle>
          <HvDialogContent>
            <img
              alt="Preview of the uploaded file"
              src={previewUrl}
              style={{ maxWidth: "100%", maxHeight: "70vh" }}
            />
          </HvDialogContent>
        </HvDialog>
      </>
    );
  },
};

export const SingleUpload: StoryObj<HvFileUploaderProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "FileUploader which permits the upload of a single file at a time",
      },
    },
  },
  render: () => {
    const [list, setList] = useState<HvFileData[]>([]);

    const addFile = (file: HvFileData) => {
      const newFile = file;

      const hasFailed = file.status === "fail";

      if (!hasFailed) {
        newFile.status = "progress";
        newFile.progress = 0;

        simulateUpload(
          newFile,
          (progress) => {
            newFile.progress = progress;

            setList((previousList) => [...previousList]);
          },
          () => {
            newFile.status = "success";

            setList((previousList) => [...previousList]);
          },
        );
      }

      setList((previousList) => [newFile, ...previousList]);
    };

    const removeFile = (fileToRemove: HvFileData) => {
      if (fileToRemove.status === "progress") {
        cancelUpload(fileToRemove);
      }

      setList((previousList) =>
        previousList.filter((file) => file !== fileToRemove),
      );
    };

    return (
      <HvFileUploader
        fileList={list}
        onFilesAdded={(newFiles) => {
          newFiles.forEach((newFile) => addFile(newFile));
        }}
        onFileRemoved={(removedFile) => {
          removeFile(removedFile);
        }}
        accept=".jpg,.jpeg,.png"
        maxFileSize={1 * 1000 ** 2}
        multiple={false}
        disabled={list.length === 1}
      />
    );
  },
};

export const CustomizedFileTypes: StoryObj<HvFileUploaderProps> = {
  parameters: {
    docs: {
      description: {
        story: "FileUploader which restricts the upload to xls and xlsx files.",
      },
    },
  },
  render: () => {
    const [list, setList] = useState<HvFileData[]>([]);

    const addFile = (file: HvFileData) => {
      const newFile = file;

      const hasFailed = file.status === "fail";

      if (!hasFailed) {
        newFile.status = "progress";
        newFile.progress = 0;

        simulateUpload(
          newFile,
          (progress) => {
            newFile.progress = progress;

            setList((previousList) => [...previousList]);
          },
          () => {
            newFile.status = "success";

            setList((previousList) => [...previousList]);
          },
        );
      }

      setList((previousList) => [newFile, ...previousList]);
    };

    const removeFile = (fileToRemove: HvFileData) => {
      if (fileToRemove.status === "progress") {
        cancelUpload(fileToRemove);
      }

      setList((previousList) =>
        previousList.filter((file) => file !== fileToRemove),
      );
    };

    return (
      <HvFileUploader
        fileList={list}
        onFilesAdded={(newFiles) => {
          newFiles.forEach((newFile) => addFile(newFile));
        }}
        onFileRemoved={(removedFile) => {
          removeFile(removedFile);
        }}
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        label="Upload your spreadsheets"
        labels={{
          acceptedFiles: "(excel files)",
        }}
      />
    );
  },
};
