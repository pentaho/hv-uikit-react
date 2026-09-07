/** Shared v6 → v7 migration data, derived from the v7 migration guide. */

/** Packages renamed 1:1, keeping their name after the scope swap. */
export const SCOPE_FROM = "@hitachivantara/";
export const SCOPE_TO = "@pentaho/";

/** Packages whose name also changed. */
export const RENAMED_PACKAGES = {
  "@hitachivantara/uikit-react-pentaho": "@pentaho/uikit-react-widgets",
};

/** Packages with no v7 equivalent. */
export const REMOVED_PACKAGES = {
  "@hitachivantara/uikit-react-lab":
    "removed — HvDashboard moved to @pentaho/uikit-react-widgets; the rest have no replacement",
  "@hitachivantara/uikit-react-icons":
    "internal to UI Kit from v7 and slated for deprecation — supply your own icon set",
};

/**
 * Version range per package family. The app-shell packages are released on
 * their own major line, so they cannot share the UI Kit range.
 */
export const VERSION_LINES = [
  { prefix: "@pentaho/app-shell-", range: "^3.0.0", pre: "^3.0.0-next.0" },
  { prefix: "@pentaho/", range: "^7.0.0", pre: "^7.0.0-next.0" },
];

/** Exports that survived, but from a different package. */
export const MOVED_EXPORTS = {
  HvDashboard: "@pentaho/uikit-react-widgets",
};

/** Exports renamed in v7, keyed by their v6 name. */
export const RENAMED_EXPORTS = {
  presetHv: "presetUikit",
};

/** Prop renames, keyed by component. */
export const PROP_RENAMES = {
  HvInput: {
    disableClear: "hideClear",
    disableRevealPassword: "hideRevealPassword",
    disableSearchButton: "hideSearchButton",
  },
  HvSearchInput: {
    disableClear: "hideClear",
    disableRevealPassword: "hideRevealPassword",
    disableSearchButton: "hideSearchButton",
  },
};

/** `classes` key renames, keyed by component. */
export const CLASS_RENAMES = {
  HvTableHeader: { sortIcon: "sortButton" },
  HvBreadCrumb: { a: "link" },
};

/** Components removed from core with no drop-in replacement. */
export const REMOVED_COMPONENTS = {
  HvCarousel: "use a CSS scroll-snap carousel, or Embla Carousel",
  HvControls: "copy the v6.x source into your app",
  HvLogin: "start from the v6.x Login examples",
  HvScrollToHorizontal: "use HvListContainer + HvListItem with anchor links",
  HvScrollToVertical: "use HvListContainer + HvListItem with anchor links",
  HvSimpleGrid: "use utility grid classes, e.g. grid grid-cols-2",
  HvStack: "use flex layouts, e.g. flex gap-sm",
  HvBlade: "removed with the lab package — copy the v6.x source",
  HvBlades: "removed with the lab package — copy the v6.x source",
  HvFlow: "removed with the lab package — copy the v6.x source",
  HvStepNavigation: "removed with the lab package — copy the v6.x source",
  HvWizard: "removed with the lab package — copy the v6.x source",
};

/** Props removed with a behavioural change a codemod must not guess. */
export const REVIEW_PROPS = {
  HvSlider: {
    onBeforeChange: "removed — use onChange",
    onAfterChange: "removed — use onChange",
  },
  HvBulkActions: {
    semantic: "removed — action buttons are always secondaryGhost",
  },
  HvOverflowTooltip: {
    tooltipsProps: "removed — pass tooltip props directly",
  },
  HvBannerContent: {
    content: "removed — pass the message as children",
  },
};

/** `classes` keys removed where the replacement is a selector, not a key. */
export const REVIEW_CLASSES = {
  HvTableHeader: {
    sortableHeaderText:
      "removed — target .HvTableHeader-headerText within .HvTableHeader-sortable",
  },
  HvBreadCrumb: {
    centerContainer:
      "no longer forwarded — target .HvPathElement-centerContainer",
    separatorContainer:
      "no longer forwarded — target .HvPathElement-separatorContainer",
  },
  HvCanvasSidePanel: {
    handleOpen: "removed — use classes.handle with [aria-expanded]",
    handleClose: "removed — use classes.handle with [aria-expanded]",
  },
  HvBulkActions: {
    semantic: "removed — action buttons are always secondaryGhost",
  },
};

/** Peer dependency v7 adds. */
export const ADDED_PEERS = { "@mui/utils": "^7.0.2" };

/** Theme identifier rename. */
export const THEME_NAME_FROM = "pentahoPlus";
export const THEME_NAME_TO = "pentaho";
