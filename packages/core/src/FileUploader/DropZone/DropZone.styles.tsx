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

import { outlineStyles } from "../../utils/focusUtils";

export const { staticClasses, useClasses } = createClasses("HvDropZone", {
  dropZoneContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    border: `1px dashed ${theme.colors.textDisabled}`,
    cursor: "pointer",
    backgroundColor: theme.colors.bgContainer,
    borderRadius: theme.radii.round,

    "&:hover": {
      borderColor: theme.colors.text,
    },

    "&:focus-within": {
      borderColor: theme.colors.text,
      ...outlineStyles,
    },
  },
  dropZoneLabelsGroup: {
    "& p:nth-of-type(2)": {
      marginLeft: "auto",
    },
  },
  dragAction: {
    backgroundColor: theme.colors.bgContainer,
    borderColor: theme.colors.primary,
  },
  dropZoneContainerDisabled: {
    color: theme.colors.textDisabled,
    backgroundColor: theme.colors.bgDisabled,
    borderColor: "currentcolor",
    cursor: "not-allowed",
    "&:hover": {
      borderColor: "currentcolor",
    },
  },
  inputArea: {
    opacity: 0,
    width: "100%",
    position: "absolute",
    height: "100%",
    cursor: "pointer",

    "&:disabled": {
      cursor: "not-allowed",
    },
  },
  dropArea: {
    display: "flex",
    margin: theme.spacing("md", "auto"),
    gap: theme.space.xs,
    minHeight: 48,
  },
  dropZoneAreaLabels: {
    display: "flex",
    maxWidth: 120,
    margin: "auto",
  },
  dropZoneAreaIcon: {},
  dropZoneLabel: {},
  dragText: {},
  selectFilesText: {
    fontWeight: theme.typography.label.fontWeight,
  },
});
