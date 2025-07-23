import { useContext, useRef, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFormElementContext, HvFormElementProps } from "../../FormElement";
import { HvLabelContainer } from "../../FormElement/LabelContainer";
import { useLabels } from "../../hooks/useLabels";
import { useUniqueId } from "../../hooks/useUniqueId";
import { HvIcon } from "../../icons";
import { uniqueId } from "../../utils/helpers";
import { setId } from "../../utils/setId";
import { HvFileData, HvFilesAddedEvent } from "../File";
import { convertUnits } from "../utils";
import { staticClasses, useClasses } from "./DropZone.styles";

export { staticClasses as dropZoneClasses };

export type HvDropZoneClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  /** Extensions of the accepted file types */
  acceptedFiles: "",
  /** Size file warning label. */
  sizeWarning: "Max. file size:",
  /** Size file warning label. */
  drag: "Drop files here or",
  /** Size file warning label. */
  selectFiles: "click to upload",
  /** Theming sheet used to style components */
  dropFiles: "Drop files here",
  /** Message to display when file size is greater than allowed */
  fileSizeError: "The file exceeds the maximum upload size",
  /** Message to display when file type is greater than allowed */
  fileTypeError: "File type not allowed for upload",

  removeFileButtonLabel: "Remove File",
};

export type HvDropZoneLabels = Partial<typeof DEFAULT_LABELS>;

export interface HvDropZoneProps
  extends Pick<HvFormElementProps, "id" | "disabled" | "label"> {
  /**
   * Labels to present in FileUploader.
   */
  labels?: HvDropZoneLabels;
  /**
   * Whether the Dropzone should accept multiple files at once.
   */
  multiple?: boolean;
  /**
   * Files extensions accepted for upload.
   */
  accept?: React.InputHTMLAttributes<HTMLInputElement>["accept"];
  /**
   * Max upload size
   * */
  maxFileSize: number;
  /**
   * Function responsible for processing files added to the drop zone.
   */
  onFilesAdded?: HvFilesAddedEvent;
  /**
   * Whether the DropZone should hide labels or not.
   */
  hideLabels?: boolean;
  /**
   * Attributes applied to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * A Jss Object used to override or extend the styles applied to the component.
   */
  classes?: HvDropZoneClasses;
}

// TODO: remove/review in `v6`: delegate to HTML `accept` and/or add custom validation
function validateAccept(file?: File, acceptAttr?: string) {
  if (!file || !acceptAttr) return true;

  const acceptEntries = acceptAttr.split(",");
  const fileName = file.name || "";
  const mimeType = (file.type || "").toLowerCase();
  const baseMimeType = mimeType.replace(/\/.*$/, "");

  return acceptEntries.some((type) => {
    const validType = type.trim().toLowerCase();
    if (validType.charAt(0) === ".") {
      return fileName.toLowerCase().endsWith(validType);
    }
    // This is something like a image/* mime type
    if (validType.endsWith("/*")) {
      return baseMimeType === validType.replace(/\/.*$/, "");
    }
    return mimeType === validType;
  });
}

export const HvDropZone = (props: HvDropZoneProps) => {
  const {
    id: idProp,
    classes: classesProp,
    label = "Label",
    labels: labelsProp,
    accept,
    maxFileSize,
    inputProps,
    hideLabels,
    multiple = true,
    onFilesAdded,
  } = useDefaultProps("HvDropZone", props);
  const id = useUniqueId(idProp);
  const labels = useLabels(DEFAULT_LABELS, labelsProp);
  const { classes, cx } = useClasses(classesProp);
  const { disabled } = useContext(HvFormElementContext);

  const [dragState, setDragState] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragLeave = () => {
    setDragState(false);
  };

  const handleDragEnter: React.DragEventHandler = (event) => {
    if (disabled) return;
    event.stopPropagation();
    event.preventDefault();
    setDragState(true);
  };

  const onChangeHandler = (filesList: FileList) => {
    const filesToProcess = Object.values(filesList);

    const newFiles = filesToProcess.map((file) => {
      const newFile: HvFileData = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
      newFile.id = uniqueId("uploaded-file-data-");

      const isSizeAllowed = file.size <= maxFileSize;
      const isFileAccepted =
        !accept ||
        accept.includes(file.type?.split("/")[1]) || // TODO: remove in v6
        validateAccept(file, accept);

      if (!isFileAccepted) {
        newFile.errorMessage = labels?.fileTypeError;
        newFile.status = "fail";
      } else if (!isSizeAllowed) {
        newFile.errorMessage = labels?.fileSizeError;
        newFile.status = "fail";
      }

      return newFile;
    });

    onFilesAdded?.(newFiles);
  };

  const description = (
    <>
      {Number.isInteger(maxFileSize) &&
        `${labels.sizeWarning} ${convertUnits(maxFileSize)}`}
      {labels.acceptedFiles ||
        (accept && `\u00A0(${accept?.replaceAll(",", ", ")})`)}
    </>
  );

  return (
    <>
      {!hideLabels && (
        <HvLabelContainer
          id={id}
          label={label}
          description={description}
          inputId={setId(id, "input-file")}
          classes={{
            root: classes.dropZoneLabelsGroup,
            label: classes.dropZoneLabel,
          }}
        />
      )}
      <div
        className={cx(classes.dropZoneContainer, {
          [classes.dragAction]: dragState,
          [classes.dropZoneContainerDisabled]: disabled,
        })}
      >
        <input
          id={setId(id, "input-file")}
          className={classes.inputArea}
          type="file"
          multiple={multiple}
          disabled={disabled}
          title={!disabled ? `${labels?.drag}\xa0${labels?.selectFiles}` : ""}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.value = "";
            }
          }}
          onChange={() => {
            if (!disabled && inputRef.current?.files) {
              onChangeHandler(inputRef.current.files);
            }
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDropCapture={handleDragLeave}
          onDrop={(event) => {
            if (disabled) return;

            const { files } = event.dataTransfer;
            if (multiple === true || files.length === 1) {
              event.stopPropagation();
              event.preventDefault();
              onChangeHandler(files);
            }
          }}
          ref={inputRef}
          accept={accept}
          {...inputProps}
        />
        <div className={classes?.dropArea}>
          {dragState ? (
            <div className={classes.dropZoneAreaLabels}>
              <div className={classes.dragText}>{labels?.dropFiles}</div>
            </div>
          ) : (
            <>
              <HvIcon
                name="Doc"
                size="md"
                className={classes.dropZoneAreaIcon}
              />
              <div className={classes.dropZoneAreaLabels}>
                <div className={classes.dragText}>
                  {labels?.drag}
                  <span
                    className={classes.selectFilesText}
                  >{`\xa0${labels?.selectFiles}`}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
