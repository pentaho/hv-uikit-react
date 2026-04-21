import MuiCardMedia, {
  type CardMediaProps as MuiCardMediaProps,
} from "@mui/material/CardMedia";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { staticClasses, useClasses } from "./Media.styles";

export { staticClasses as cardMediaClasses };

export type HvCardMediaClasses = ExtractNames<typeof useClasses>;

export interface HvCardMediaProps
  extends
    Omit<MuiCardMediaProps, "classes">,
    React.ImgHTMLAttributes<HTMLDivElement> {
  /** The title of the media. */
  title?: string;
  /** The function that will be executed when this section is clicked. */
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  /** The component used for the root node. Either a string to use a HTML element or a component. */
  component?: React.ElementType;
  /** The image to display. */
  image?: string;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvCardMediaClasses;
}

export const HvCardMedia = ({
  classes: classesProp,
  className,
  children,
  ...others
}: HvCardMediaProps) => {
  const { classes } = useClasses(classesProp);
  return (
    <MuiCardMedia
      classes={{
        root: classes.root,
        media: classes.media,
      }}
      className={className}
      role="img"
      {...others}
    >
      {children}
    </MuiCardMedia>
  );
};
