import { createClasses } from "@hitachivantara/uikit-react-core";
import { theme } from "@hitachivantara/uikit-styles";

export const { useClasses } = createClasses("TagsList", {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    overflow: "auto",
    gap: theme.space.xs,
  },
  row: {
    display: "flex",
    gap: theme.space.xs,
  },
  hidden: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    display: "flex",
    gap: theme.space.xs,
  },
  panel: {
    minWidth: "fit-content",
    padding: theme.space.sm,
    display: "flex",
    flexDirection: "column",
    gap: theme.space.sm,
    maxHeight: 200,
    overflowY: "auto",
    // prevent tags from squashing in height
    "& > *": { flexShrink: 0 },
  },
  search: {
    width: 118,
  },
  extraTags: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.space.xs,
  },
});
