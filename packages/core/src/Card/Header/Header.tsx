import MuiCardHeader, {
  CardHeaderProps as MuiCardHeaderProps,
} from "@mui/material/CardHeader";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { staticClasses, useClasses } from "./Header.styles";

export { staticClasses as cardHeaderClasses };

export type HvCardHeaderClasses = ExtractNames<typeof useClasses>;

export interface HvCardHeaderProps extends Omit<MuiCardHeaderProps, "classes"> {
  /** The renderable content inside the title slot of the header. */
  title: React.ReactNode;
  /** The renderable content inside the subheader slot of the header. */
  subheader?: React.ReactNode;
  /** The renderable content inside the icon slot of the header. */
  icon?: React.ReactNode;
  /** The function that will be executed when this section is clicked. */
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvCardHeaderClasses;
}

export const HvCardHeader = (props: HvCardHeaderProps) => {
  const {
    classes: classesProp,
    className,
    title,
    subheader,
    icon,
    onClick,
    ...others
  } = useDefaultProps("HvCardHeader", props);
  const { classes, cx } = useClasses(classesProp);

  return (
    <MuiCardHeader
      title={title}
      subheader={subheader}
      action={icon}
      onClick={onClick}
      className={cx(classes.root, className)}
      classes={{
        title: classes.title,
        subheader: classes.subheader,
        action: classes.action,
        content: classes.content,
      }}
      {...others}
    />
  );
};
