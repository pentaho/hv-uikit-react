import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../../types/generic";
import { HvHeaderMenuItem } from "../MenuItem";
import type { HvHeaderNavigationItemProp } from "../useSelectionPath";
import { Bar, type BarProps, type HvHeaderMenuBarClasses } from "./Bar";

export interface HvHeaderMenuBarProps
  extends HvBaseProps<HTMLDivElement, "onClick"> {
  data: HvHeaderNavigationItemProp[];
  type?: BarProps["type"];
  onClick?: (
    event: React.MouseEvent,
    selection: HvHeaderNavigationItemProp,
  ) => void;
  levels: number;
  currentLevel: number;
  classes?: HvHeaderMenuBarClasses;
}

export const HvHeaderMenuBar = (props: HvHeaderMenuBarProps) => {
  const {
    data = [],
    onClick,
    type = "menubar",
    levels,
    currentLevel,
    classes,
    ...others
  } = useDefaultProps("HvHeaderMenuBar", props);
  return (
    <Bar data={data} type={type} classes={classes} {...others}>
      {data.map((item) => (
        <HvHeaderMenuItem
          key={item.id}
          item={item}
          type={type}
          onClick={onClick}
          levels={levels}
          currentLevel={currentLevel}
        />
      ))}
    </Bar>
  );
};
