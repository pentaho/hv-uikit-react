import { useContext } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvListContainer, HvListItem } from "../../ListContainer";
import { HvOverflowTooltip } from "../../OverflowTooltip";
import { HvPanel } from "../../Panel";
import { HvFilterGroupCounter } from "../Counter";
import { HvFilterGroupContext } from "../FilterGroupContext";
import { staticClasses, useClasses } from "./LeftPanel.styles";

export { staticClasses as filterGroupLeftPanelClasses };

export type HvFilterGroupLeftPanelClasses = ExtractNames<typeof useClasses>;

export interface HvFilterGroupLeftPanelProps {
  id?: string;
  className?: string;
  emptyElement?: React.ReactNode;
  classes?: HvFilterGroupLeftPanelClasses;
}

export const HvFilterGroupLeftPanel = ({
  className,
  emptyElement,
  classes: classesProp,
}: HvFilterGroupLeftPanelProps) => {
  const { classes } = useClasses(classesProp);
  const { filterOptions, activeGroup, setActiveGroup } =
    useContext(HvFilterGroupContext);

  return (
    <HvPanel className={className}>
      {filterOptions.length > 0 ? (
        <HvListContainer condensed interactive>
          {filterOptions.map((group, index) => (
            <HvListItem
              key={group.id || group.name}
              className={classes.listItem}
              onClick={() => setActiveGroup(index)}
              selected={filterOptions[activeGroup].id === group.id}
              endAdornment={<HvFilterGroupCounter groupId={group.id} />}
            >
              <HvOverflowTooltip data={group.name} />
            </HvListItem>
          ))}
        </HvListContainer>
      ) : (
        emptyElement
      )}
    </HvPanel>
  );
};
