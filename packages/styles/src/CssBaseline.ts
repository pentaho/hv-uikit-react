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
import { theme } from "./theme";

const baseline = {
  /* Clears input's clear button from Chrome */
  'input[type="search"]::-webkit-search-decoration': { display: "none" },
  'input[type="search"]::-webkit-search-cancel-button': { display: "none" },
  'input[type="search"]::-webkit-search-results-button': { display: "none" },
  'input[type="search"]::-webkit-search-results-decoration': {
    display: "none",
  },

  "*, ::before, ::after": {
    boxSizing: "border-box",
    borderWidth: "0",
    borderStyle: "solid",
  },

  /* Remove default margin. */
  "*": {
    margin: 0,
  },

  /* Headings are unstyled. */
  ":where(h1, h2, h3, h4, h5, h6)": {
    fontSize: "inherit",
    fontWeight: "inherit",
  },

  /* Avoid text overflows. */
  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },

  /* Improve media defaults. */
  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },

  /* Remove built-in form typography styles. */
  "button, input, textarea, select, optgroup": {
    fontFamily: "inherit",
    fontSize: "100%",
  },

  select: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
    background: "transparent",
  },

  /* Buttons have a default outline. */
  "button:focus-visible": {
    outline: "#52A8EC solid 0px",
    outlineOffset: "-1px",
  },

  /* fieldset have no margin and padding. */
  fieldset: {
    margin: 0,
    padding: 0,
  },

  /* List have no margin and padding. */
  ":where(ol, ul)": {
    margin: 0,
    padding: 0,
  },

  /* Anchor are unstyled. */
  a: {
    backgroundColor: "transparent",
    color: "inherit",
    textDecoration: "inherit",
  },

  ".uikit-root-element": {
    backgroundColor: theme.colors.bgPage,
    accentColor: theme.colors.text,
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    lineHeight: theme.typography.body.lineHeight,
    letterSpacing: theme.typography.body.letterSpacing,
    fontFamily: theme.fontFamily.body,
  },
} as const;

export const CssScopedBaseline = {
  height: "100%",
  fontFamily: "inherit",
  lineHeight: "inherit",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  ...baseline,
} as const;

export const CssBaseline = {
  /* Allow percentage-based heights in the application. */
  "html, body": {
    height: "100%",
  },

  html: {
    fontFamily: "'Open Sans','Inter', Arial, Helvetica, sans-serif",
  },

  body: {
    fontFamily: "inherit",
    lineHeight: "inherit",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },

  ...baseline,
} as const;
