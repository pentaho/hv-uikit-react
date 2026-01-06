import {
  ExtractNames,
  useDefaultProps,
} from "@hitachivantara/uikit-react-utils";

import { HvFormElement, HvFormElementProps } from "../FormElement";
import { useLabels } from "../hooks/useLabels";
import { HvDropZone, HvDropZoneLabels, HvDropZoneProps } from "./DropZone";
import { HvFileData, HvFileRemovedEvent, HvFilesAddedEvent } from "./File";
import { HvFileList } from "./FileList";
import { staticClasses, useClasses } from "./FileUploader.styles";

export { staticClasses as fileUploaderClasses };

export type HvFileUploaderClasses = ExtractNames<typeof useClasses>;

export interface HvFileUploaderLabels extends HvDropZoneLabels {
  /** Value of aria-label to apply to remove file button in FileList */
  removeFileButtonLabel?: string;
}

export interface HvFileUploaderProps extends HvFormElementProps {
  /**
   * An object containing all the labels.
   */
  labels?: HvFileUploaderLabels;
  /**
   * An object used to override or extend the styles applied to the component.
   */
  classes?: HvFileUploaderClasses;
  /**
   * The files to upload.
   */
  fileList?: HvFileData[];
  /**
   * Whether the Dropzone should accept multiple files at once.
   */
  multiple?: boolean;
  /**
   * If the input is disabled or not
   */
  disabled?: boolean;
  /**
   * Max upload size
   * */
  maxFileSize?: number;
  /** File types accepted for uploading. @see [HTML input file accept](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept) */
  accept?: HvDropZoneProps["accept"];
  /**
   * Callback fired when files are added.
   */
  onFilesAdded?: HvFilesAddedEvent;
  /**
   * Callback fired when file is removed from list.
   */
  onFileRemoved?: HvFileRemovedEvent;
  /**
   * Whether the DropZone should hide labels or not.
   */
  hideLabels?: boolean;
  /**
   * Attributes applied to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

// TODO: This component needs to adopt the Form element shape and deprecate its way of composing labels

const DEFAULT_LABELS = {
  removeFileButtonLabel: "Remove File",
};

/**
 * Lets the user choose one or more files from their device storage. Once chosen,
 * the files can be uploaded to a server or manipulated on the client side.
 */
export const HvFileUploader = (props: HvFileUploaderProps) => {
  const {
    id,
    className,
    classes: classesProp,
    labels: labelsProp,
    fileList,
    multiple = true,
    label,
    hideLabels,
    maxFileSize = Infinity,
    inputProps = {},
    accept,
    // TODO: consider adding/replacing with onFilesChange
    onFilesAdded,
    onFileRemoved,
    ...others
  } = useDefaultProps("HvFileUploader", props);
  const { classes, cx } = useClasses(classesProp);
  const labels = useLabels(DEFAULT_LABELS, labelsProp);

  return (
    <HvFormElement id={id} className={cx(classes.root, className)} {...others}>
      <HvDropZone
        label={label}
        labels={labels}
        multiple={multiple}
        accept={accept}
        maxFileSize={maxFileSize}
        onFilesAdded={onFilesAdded}
        inputProps={inputProps}
        hideLabels={hideLabels}
      />
      <HvFileList
        list={fileList}
        onFileRemoved={onFileRemoved}
        removeFileButtonLabel={labels?.removeFileButtonLabel}
      />
    </HvFormElement>
  );
};
