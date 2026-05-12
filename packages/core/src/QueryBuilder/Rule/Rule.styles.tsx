import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { staticClasses as queryBuilderClasses } from "../QueryBuilder.styles";

export const { useClasses } = createClasses("HvQueryBuilderRule", {
  root: {
    position: "relative",
    marginTop: theme.space.xs,
    minHeight: 94,

    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr 32px",
    gridTemplateAreas: '"attribute operator value actions"',
    gap: theme.space.md,

    "&:>*": {
      minWidth: 0,
    },

    // hide required * as all fields are required
    "& label>span[aria-hidden]": {
      visibility: "hidden",
    },

    "&::before": {
      content: '""',
      position: "absolute",
      zIndex: 2,

      width: "17px",
      height: "44px",

      borderBottom: `1px solid ${theme.colors.border}`,
      borderLeft: `1px solid ${theme.colors.border}`,

      top: 0,
      left: `calc(-1 * 17px)`,
    },

    [`:not(.${queryBuilderClasses.topRulesContainer})>&:last-child::after`]: {
      content: '""',
      position: "absolute",
      zIndex: 1,

      width: "17px",
      height: "100%",

      borderLeft: `1px solid ${theme.colors.border}`,

      top: 0,
      left: `calc(-1 * 17px)`,
    },
  },
  actionsContainer: {
    gridArea: "actions",
    justifySelf: "end",
    marginTop: "24px",
  },
  isMdDown: {
    gridTemplateColumns: "1fr",
    gridTemplateAreas: '"attribute" "operator" "value" "actions"',
    gap: theme.space.xs,

    "& $actionsContainer": {
      marginTop: 0,
    },
  },
});
