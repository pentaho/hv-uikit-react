import {
  createClasses,
  ExtractNames,
  mergeStyles,
  useDefaultProps,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvButtonBase, HvButtonBaseProps } from "../ButtonBase";

const { useClasses } = createClasses("HvColorPickerSwatch", {
  root: {
    width: "32px",
    height: "32px",
    borderRadius: theme.radii.base,
    ":focus": {
      boxShadow: `rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset, var(--color) 0px 0px 4px`,
    },
    "&,&:hover,&:focus-visible": {
      backgroundColor: "var(--color)",
    },
  },
});

type SwatchClasses = ExtractNames<typeof useClasses>;

export interface SwatchProps extends HvButtonBaseProps {
  color: string;
  classes?: SwatchClasses;
}

export const Swatch = (props: SwatchProps) => {
  const {
    classes: classesProp,
    className,
    style,
    color,
    ...others
  } = useDefaultProps("HvColorPickerSwatch", props);
  const { classes, cx } = useClasses(classesProp);
  return (
    <HvButtonBase
      title={color}
      style={mergeStyles(style, { "--color": color })}
      className={cx(classes.root, className)}
      {...others}
    />
  );
};
