import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../../icons";
import { staticClasses, useClasses } from "./PathElement.styles";

export { staticClasses as pathElementClasses };

export type HvPathElementClasses = ExtractNames<typeof useClasses>;

export interface HvPathElementProps {
  last?: boolean;
  classes?: HvPathElementClasses;
  separator?: React.ReactNode;
  children: React.ReactElement<any>;
}

export const HvPathElement = ({
  classes: classesProp,
  last = false,
  separator,
  children,
}: HvPathElementProps) => {
  const { classes } = useClasses(classesProp);

  return (
    <li className={classes.centerContainer}>
      {children}
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
