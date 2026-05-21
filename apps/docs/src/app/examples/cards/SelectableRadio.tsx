import { useRef, useState } from "react";
import {
  HvBaseRadio,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvStatusIcon,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [selected, setSelected] = useState(false);
  const radioRef = useRef<HTMLButtonElement>(null);

  return (
    <HvCard
      bgcolor="bgContainer"
      className="w-full rounded-round hover:cursor-pointer"
      selectable
      selected={selected}
      onClick={() => radioRef.current?.click()}
    >
      <HvCardHeader
        title={
          <div className="flex justify-start items-center">
            <HvBaseRadio
              ref={radioRef}
              checked={selected}
              onClick={() => setSelected(!selected)}
              aria-label="Card selection"
            />
            <div className="flex gap-xs items-center">
              <HvStatusIcon
                variant="default"
                customIcon={<div className="i-ph-gear" />}
              />
              <HvTypography variant="title4">Title</HvTypography>
            </div>
          </div>
        }
      />
      <HvCardContent className="pl-lg pt-0 ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc fermentum,
        sem quis lobortis varius.
      </HvCardContent>
    </HvCard>
  );
}
