import { useState } from "react";
import {
  HvButtonBase,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvStatusIcon,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex">
      <HvCard
        bgcolor="bgContainer"
        className="w-320px rounded-round"
        selectable
        selected={selected}
      >
        <HvButtonBase
          onClick={() => setSelected(!selected)}
          aria-label="Press enter or space to select the Card."
          className="flex flex-col w-full text-left p-0 hover:cursor-pointer bg-transparent"
        >
          <HvCardHeader
            icon={
              <HvStatusIcon
                variant="default"
                customIcon={<div className="i-ph-gear" />}
              />
            }
            title={<HvTypography variant="title4">Title</HvTypography>}
          />
          <HvCardContent className="pt-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            fermentum, sem quis lobortis varius.
          </HvCardContent>
        </HvButtonBase>
      </HvCard>
    </div>
  );
}
