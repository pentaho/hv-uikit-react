import { useTheme, type ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../../icons";
import { staticClasses, useClasses } from "./PathElement.styles";

export { staticClasses as pathElementClasses };

export type HvPathElementClasses = ExtractNames<typeof useClasses>;

export interface HvPathElementProps {
  last?: boolean;
  first?: boolean;
  classes?: HvPathElementClasses;
  separator?: React.ReactNode;
  children: React.ReactElement<any>;
}

export const HvPathElement = ({
  classes: classesProp,
  last = false,
  first = false,
  separator,
  children,
}: HvPathElementProps) => {
  const { classes } = useClasses(classesProp);

  const { activeTheme } = useTheme();

  return (
    <li className={classes.centerContainer}>
      {first && activeTheme?.name === "pentahoPlus" ? (
        <HvIcon
          name="Home"
          size="sm"
          style={{ marginLeft: 4, marginRight: 4 }}
        />
      ) : (
        children
      )}
      {!last && separator ? (
        <div className={classes.separatorContainer}>{separator}</div>
      ) : (
        <HvIcon
          name="CaretRight"
          size="xs"
          color="textDisabled"
          style={{ marginLeft: 4, marginRight: 4 }}
        />
      )}
    </li>
  );
};
