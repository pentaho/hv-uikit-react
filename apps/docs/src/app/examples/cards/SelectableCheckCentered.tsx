import { useRef, useState } from "react";
import {
  HvBaseCheckBox,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvStatusIcon,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [selected, setSelected] = useState(false);
  const checkboxRef = useRef<HTMLButtonElement>(null);

  return (
    <HvCard
      bgcolor="bgContainer"
      className="w-full rounded-round hover:cursor-pointer"
      selectable
      selected={selected}
      onClick={() => checkboxRef.current?.click()}
    >
      <HvCardHeader
        title={
          <div className="flex justify-center items-center">
            <HvBaseCheckBox
              ref={checkboxRef}
              checked={selected}
              className="absolute top-sm left-sm"
              onClick={() => setSelected(!selected)}
              aria-label="Card selection"
            />
            <div className="flex flex-col gap-xxs items-center">
              <HvStatusIcon
                variant="default"
                size="lg"
                customIcon={<div className="i-ph-gear" />}
              />
              <HvTypography variant="title4">Title</HvTypography>
            </div>
          </div>
        }
      />
      <HvCardContent className="pl-lg pt-0 text-center">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc fermentum,
        sem quis lobortis varius.
      </HvCardContent>
    </HvCard>
  );
}
