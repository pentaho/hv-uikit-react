/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
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
          className="flex flex-col w-full text-left bg-transparent hover:cursor-pointer"
        >
          <HvCardHeader
            title={
              <div className="flex justify-center items-center">
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
          <HvCardContent className="pt-0 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            fermentum, sem quis lobortis varius.
          </HvCardContent>
        </HvButtonBase>
      </HvCard>
    </div>
  );
}
