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
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { outlineStyles } from "../utils/focusUtils";
import base from "./base";

const dot: React.CSSProperties = {
  position: "absolute",
  bottom: "-1px",
  marginLeft: "0px",
  width: "1px",
  height: "4px",
  border: "none",
  backgroundColor: theme.colors.border,
  cursor: "pointer",
  verticalAlign: "middle",
  zIndex: "-3",
};

const dragSquare: React.CSSProperties = {
  cursor: "grab",
  width: "calc(100% - 40px)",
  left: "20px",
  height: "27px",
  position: "absolute",
  top: "-12px",
  content: "''",
  background: "transparent",
  borderTop: `12px solid ${theme.colors.primaryDimmed}`,
  borderBottom: `12px solid ${theme.colors.primaryDimmed}`,
  zIndex: "-2",
};

const ring: React.CSSProperties = {
  width: "32px",
  height: "32px",
  borderRadius: theme.radii.full,
  border: `9px solid ${theme.colors.primaryDimmed}`,
  opacity: "100%",
  content: "''",
  position: "absolute",
  top: "-10px",
  left: "-10px",
};

const border: React.CSSProperties = {
  width: "20px",
  height: "20px",
  borderRadius: theme.radii.full,
  border: `2px solid ${theme.colors.textDimmed}`,
  content: "''",
  position: "absolute",
  top: "-4px",
  left: "-4px",
};

export const sliderStyles = {
  mark: {
    ...theme.typography.caption1,
    fontFamily: theme.fontFamily.body,
    top: "-2px",
    zIndex: -1,
  },
  disabledMark: {
    ...theme.typography.caption1,
    fontFamily: theme.fontFamily.body,
    color: theme.colors.textDisabled,
    cursor: "not-allowed",
    top: "-2px",
  },
  dot: {
    ...dot,
  },
  dotDisabled: {
    ...dot,
    cursor: "not-allowed",
  },
  knobHidden: { display: "none" },
  knobHiddenLast: {
    borderColor: "transparent",
    height: "3px",
    width: "2px",
    marginLeft: "-1px",
    border: "none",
    marginTop: "0px",
    left: "100%",
    touchAction: "none",
    cursor: "default",
  },
  knobInner: {
    borderColor: "transparent",
    boxShadow: "none",
    backgroundColor: theme.colors.text,
    width: "16px",
    height: "16px",
  },
  knobOuter: {
    position: "relative",
    borderColor: "transparent",
    borderRadius: theme.radii.full,
    boxShadow: "none",
    backgroundColor: theme.colors.border,
    width: "32px",
    height: "32px",
    top: "-80%",
    left: "-80%",
    zIndex: "-1",
  },
  track: {
    backgroundColor: theme.colors.text,
    height: "3px",
    zIndex: "-1",
    marginTop: "-1px",
  },
  rail: { backgroundColor: theme.colors.border, height: "1px", zIndex: "-3" },
} satisfies Record<string, React.CSSProperties>;

export const { staticClasses, useClasses } = createClasses("HvSlider", {
  sliderBase: { ...base },
  rootDisabled: {
    cursor: "not-allowed",
    "&& .rc-slider-disabled": {
      background: "transparent",
    },
  },
  sliderContainer: { marginBottom: "18px", padding: "0 23px" },
  error: { padding: "0 8px" },
  trackDragging: {
    cursor: "grabbing",

    "&& .rc-slider-track": {
      "&::before": {
        ...dragSquare,
        cursor: "grabbing",
      },
    },
  },
  trackStandBy: {
    "&& .rc-slider-track": {
      "&:hover": {
        "&::before": {
          ...dragSquare,
        },
      },
    },
  },
  sliderRoot: { zIndex: 0 },
  rootRange: {},
  handleContainer: {
    "&& .rc-slider-handle": {
      cursor: "pointer",
      marginTop: "-8px",
      opacity: 1,
      "&:active": {
        cursor: "grab",
        "&::before": {
          ...ring,
        },
        "&::after": {
          ...border,
        },
      },
      "&:hover": {
        "&::before": {
          ...ring,
        },
        "&::after": {
          ...border,
        },
      },

      // Note about the usage of `!important below`: the way the rc-slider allows us to
      // style the knobs is through inline styles. This means that the `box-shadow`, which
      // is an inline style and is set to `none` to prevent the default rc-slider style to
      // show, can't be overridden for the focus scenario unless we use the `!important` flag.
      "&:focus-visible": {
        ...outlineStyles,
        boxShadow: "0 0 0 3px #52A8EC, 0 0 0 7px rgba(29,155,209,.3)!important",
        "&::after": {
          ...border,
        },
      },
    },
  },
  handle: {},
  handleContainerDisabled: {
    "&& .rc-slider-handle": {
      cursor: "not-allowed",
      marginTop: "-8px",
      opacity: 1,
      "&:active": {
        cursor: "not-allowed",
      },
      "&:hover": {
        cursor: "not-allowed",
      },
    },
  },
  handleHiddenContainer: { display: "none" },
  labelContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
    marginLeft: "20px",
    marginRight: "20px",
  },
  labelIncluded: { justifyContent: "space-between" },
  onlyInput: { justifyContent: "flex-end" },
  label: {},
  root: {},
  sliderTooltip: {
    "&& .rc-slider-tooltip-inner": {
      background: theme.colors.bgContainer,
      borderRadius: 0,
      maxWidth: "532px",
      height: "100%",
      padding: theme.space.sm,
      ...theme.typography.body,
      fontFamily: theme.fontFamily.body,
      boxShadow: "none",
    },

    "&& .rc-slider-tooltip-arrow": {
      visibility: "hidden",
    },
  },
});
