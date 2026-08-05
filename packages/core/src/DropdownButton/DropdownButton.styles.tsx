import { createClasses } from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { buttonClasses } from "../Button";

// TODO: review override
const disabledStyle = {
  [`&,&.${buttonClasses.subtle},&.${buttonClasses.ghost}`]: {
    backgroundColor: theme.colors.bgDisabled,
    borderColor: theme.colors.bgDisabled,
    "&:hover": { backgroundColor: theme.colors.bgDisabled },
  },
};

export const { staticClasses, useClasses } = createClasses("HvDropdownButton", {
  root: {
    userSelect: "none",
    position: "relative",

    [`&:not(.${buttonClasses.icon})`]: {
      width: "100%",
      minWidth: "unset",
      justifyContent: "flex-start",
      paddingLeft: theme.space.xs,
    },
  },
  disabled: {
    ...disabledStyle,
  },
  readOnly: {
    userSelect: "text",
    ...disabledStyle,
  },
  open: {
    backgroundColor: theme.colors.bgContainer,
  },
  selection: {
    color: "inherit",
    flex: 1,
    textAlign: "start",
    overflow: "auto",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  placeholder: {},
  arrowContainer: {
    marginRight: theme.spacing(-2),
  },
});
