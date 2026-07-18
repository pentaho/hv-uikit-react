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
import { css } from "@emotion/css";
import {
  HvActionBar,
  HvActionsGeneric,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvCheckBox,
  HvToggleButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Favorite, FavoriteSelected } from "@hitachivantara/uikit-react-icons";

const SingleContent = () => (
  <HvCardContent>
    <div style={{ marginTop: "20px" }}>
      <HvTypography variant="label">ID</HvTypography>
      <HvTypography>2101cad3-7cd4-1000-bdp95-d8c497176e7c</HvTypography>
    </div>
    <div style={{ marginTop: "20px" }}>
      <HvTypography variant="label">Last connected</HvTypography>
      <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
    </div>
  </HvCardContent>
);

const classes = {
  button: css({
    cursor: "pointer",
    textAlign: "inherit",
    backgroundColor: "transparent",
    margin: 0,
    border: 0,
    padding: 0,
    width: "100%",
    "&:focus": {
      outline: "none",
    },
  }),
};

export const Selectable = () => {
  const [checked, setChecked] = useState(false);

  return (
    <HvCard
      bgcolor="bgContainer"
      style={{ width: 360 }}
      selectable
      selected={checked}
    >
      <button
        className={classes.button}
        type="button"
        onClick={() => setChecked(!checked)}
        aria-label="Press enter or space to select the asset avatar L90 card."
        tabIndex={-1}
      >
        <HvCardHeader title="Asset Avatar L90" subheader="Compressor" />
        <HvCardMedia
          component="img"
          image="https://i.imgur.com/bxPPTD3.png"
          height={140}
          alt="Compressor"
        />
        <SingleContent />
      </button>
      <HvActionBar>
        <HvCheckBox
          onChange={() => setChecked(!checked)}
          checked={checked}
          value="value"
          inputProps={{
            "aria-label": "Tick to select the asset avatar L90 card.",
          }}
        />
        <div style={{ width: 32, height: 32 }}>
          <HvToggleButton
            aria-label="Star"
            selectedIcon={<FavoriteSelected />}
            notSelectedIcon={<Favorite />}
          />
        </div>
        <div style={{ flex: 1 }} />
        <HvActionsGeneric
          actions={[
            { id: "view", label: "View" },
            { id: "dismiss", label: "Dismiss" },
          ]}
        />
      </HvActionBar>
    </HvCard>
  );
};
