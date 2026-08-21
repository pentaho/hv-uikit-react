import { createClasses, type ExtractNames } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { HvIcon } from "../icons";

export const { staticClasses, useClasses } = createClasses("HvPathElement", {
  centerContainer: {
    display: "flex",
    alignItems: "center",
  },
  separatorContainer: {
    padding: `0 ${theme.space.xxs}`,
  },
});

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
      {!last && (
        <div className={classes.separatorContainer}>
          {separator || (
            <HvIcon name="CaretRight" size="xs" color="textSubtle" />
          )}
        </div>
      )}
    </li>
  );
};
