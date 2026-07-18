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
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIconButton } from "../../IconButton";
import { HvIcon } from "../../icons";
import { HvProgressBar } from "../../ProgressBar";
import { HvTypography } from "../../Typography";
import { convertUnits } from "../utils";
import { staticClasses, useClasses } from "./File.styles";

export { staticClasses as fileClasses };

export type HvFileClasses = ExtractNames<typeof useClasses>;

export interface HvFileData extends Omit<File, "name" | "size"> {
  /**
   * The file id.
   */
  id?: string;
  /**
   * The file name.
   */
  name?: string;
  /**
   * The upload status.
   */
  status?: "progress" | "success" | "fail";
  /**
   * The file size in bytes.
   */
  size?: number;
  /**
   * Upload progress in bytes.
   */
  progress?: number;
  /**
   * Optional node representing a preview of the uploaded file.
   */
  preview?: React.ReactNode;
  /**
   * Error message when the upload failed.
   */
  errorMessage?: string;
}

export type HvFilesAddedEvent = (files: HvFileData[]) => void;

export type HvFileRemovedEvent = (file: HvFileData) => void;

export type HvFileProps = {
  /**
   * Id to be applied to the root node.
   */
  id?: string;
  /**
   * File information to be displayed.
   */
  data: HvFileData;
  /**
   * Callback fired when file is removed from list.
   */
  onFileRemoved?: HvFileRemovedEvent;
  /**
   * Value of aria-label to apply to remove file button in file list.
   * */
  removeFileButtonLabel?: string;
  /**
   * A Jss Object used to override or extend the styles applied to the component.
   */
  classes?: HvFileClasses;
};

const getStatusIcon = (
  classes?: HvFileClasses,
  status?: HvFileData["status"],
) => {
  switch (status) {
    case "success":
      return (
        <HvIcon name="Success" className={classes?.icon} color="positive" />
      );
    case "fail":
      return <HvIcon name="Fail" className={classes?.icon} color="negative" />;
    default:
      return <div className={classes?.icon} />;
  }
};

const getProgressText = (data: HvFileData, classes?: HvFileClasses) => {
  const hasFailed = data.status === "fail";
  const inProgress = data.status === "progress";

  return (
    <>
      {data.progress || data.size || data.errorMessage ? `\xa0|\xa0` : null}

      {inProgress && data.progress != null && (
        <HvTypography variant="label">
          {`${convertUnits(data.progress)}\xa0/\xa0`}
        </HvTypography>
      )}

      {!hasFailed && data.size && (
        <HvTypography>{`${convertUnits(data.size)}`}</HvTypography>
      )}

      {hasFailed && data.errorMessage && (
        <HvTypography className={classes?.fail}>
          {data.errorMessage}
        </HvTypography>
      )}
    </>
  );
};

const getProgressBarWith = ({ size, progress }: HvFileData) => {
  const width =
    progress != null && size != null ? Math.round((progress * 100) / size) : 0;

  return width;
};

export const HvFile = (props: HvFileProps) => {
  const {
    classes: classesProp,
    data,
    onFileRemoved,
    removeFileButtonLabel,
  } = useDefaultProps("HvFile", props);
  const { classes, cx } = useClasses(classesProp);

  const hasError = data.status === "fail";

  const inProgress = data.status === "progress";

  const progressText = getProgressText(data, classes);

  const statusIcon = getStatusIcon(classes, data.status);

  const currentProgress = getProgressBarWith(data);

  return (
    <li className={classes.root}>
      {!hasError && inProgress && (
        <HvProgressBar
          classes={{
            root: classes.progressbar,
            progressBarContainer: cx(
              classes.progressbarContainer,
              classes.progressbarBack,
            ),
          }}
          value={currentProgress}
          hideLabel
        />
      )}

      {statusIcon}

      <div className={classes.nameText}>
        <HvTypography noWrap variant="label">
          {data.name}
        </HvTypography>

        <span className={classes.progressTextContainer}>{progressText}</span>
      </div>

      {data.preview && (
        <div className={classes.previewContainer}>{data.preview}</div>
      )}

      <HvIconButton
        title={removeFileButtonLabel}
        className={classes.removeButton}
        onClick={() => onFileRemoved?.(data)}
      >
        <HvIcon name="Close" size="xs" />
      </HvIconButton>
    </li>
  );
};
