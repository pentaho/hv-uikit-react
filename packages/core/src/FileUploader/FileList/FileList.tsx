import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvFile, HvFileData, HvFileRemovedEvent } from "../File";
import { staticClasses, useClasses } from "./FileList.styles";

export { staticClasses as fileListClasses };

export type HvFileListClasses = ExtractNames<typeof useClasses>;

export interface HvFileListProps {
  /**
   * Id to be applied to the root node.
   */
  id?: string;
  /**
   * The files to upload.
   */
  list?: HvFileData[];
  /**
   * Callback fired when file is removed from list.
   */
  onFileRemoved?: HvFileRemovedEvent;
  /**
   * Value of aria-label to apply to remove file button in FileList
   * */
  removeFileButtonLabel?: string;
  /**
   * A Jss Object used to override or extend the styles applied to the component.
   */
  classes?: HvFileListClasses;
}

export const HvFileList = (props: HvFileListProps) => {
  const {
    classes: classesProp,
    list = [],
    removeFileButtonLabel,
    onFileRemoved,
  } = useDefaultProps("HvFileList", props);
  const { classes } = useClasses(classesProp);

  const hasFiles = list.length > 0;
  if (!hasFiles) return null;

  return (
    <ul className={classes.root}>
      {list.map((data) => (
        <HvFile
          key={data.id}
          classes={{ root: classes?.listItem }}
          data={data}
          onFileRemoved={onFileRemoved}
          removeFileButtonLabel={removeFileButtonLabel}
        />
      ))}
    </ul>
  );
};
