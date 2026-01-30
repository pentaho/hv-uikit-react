import { useTheme, type ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../../icons";
import { HvTypography } from "../../Typography";
import { staticClasses, useClasses } from "./PathElement.styles";

export { staticClasses as pathElementClasses };

export type HvPathElementClasses = ExtractNames<typeof useClasses>;

export interface HvPathElementProps {
  last?: boolean;
  first?: boolean;
  classes?: HvPathElementClasses;
  children: React.ReactElement<any>;
}

const Separator = ({ themeName }: { themeName: string }) =>
  themeName === "pentahoPlus" ? (
    <HvTypography variant="caption1" style={{ marginLeft: 4, marginRight: 4 }}>
      /
    </HvTypography>
  ) : (
    <HvIcon
      name="CaretRight"
      size="xs"
      color="textDisabled"
      style={{ marginLeft: 4, marginRight: 4 }}
    />
  );

export const HvPathElement = ({
  classes: classesProp,
  last = false,
  first = false,
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
      {!last && <Separator themeName={activeTheme?.name as string} />}
    </li>
  );
};
