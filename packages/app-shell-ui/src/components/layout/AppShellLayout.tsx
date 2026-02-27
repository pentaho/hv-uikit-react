import {
  createClasses,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";

import { useLayoutContext } from "../../providers/LayoutProvider";
import { useNavigationContext } from "../../providers/NavigationProvider";
import { Header } from "./Header/Header";
import { VerticalNavigation } from "./VerticalNavigation/VerticalNavigation";

const { useClasses } = createClasses("HvAppShellLayout", {
  root: {
    height: "100vh",
    overflow: "hidden",

    display: "grid",
    gridTemplateColumns: "var(--vNavWidth) auto",
    gridTemplateRows: "var(--headerHeight) auto",
    gridTemplateAreas: `
      "header header"
      "vnav main"
    `,
  },
  pentaho: {
    gridTemplateAreas: `
      "vnav header"
      "vnav main"
    `,
  },
  compact: {
    gridTemplateAreas: `
      "header header"
      "main main"
    `,
  },

  main: {
    gridArea: "main",
    overflowY: "auto",
  },
});

interface HvAppShellLayoutProps extends React.ComponentProps<"div"> {}

export function HvAppShellLayout({
  children,
  style,
  className,
  ...others
}: HvAppShellLayoutProps) {
  const { classes, cx } = useClasses();
  const { activeTheme } = useTheme();

  const {
    hasVerticalNavigation,
    verticalNavigationMode,
    showHeaderSubMenu,
    isCompactMode,
  } = useNavigationContext();
  const { verticalNavigationWidth } = useLayoutContext();

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";
  const showVerticalNavigation =
    hasVerticalNavigation && verticalNavigationMode !== "CLOSED";

  return (
    <div
      className={cx(classes.root, className, {
        // order (priority) of these classes is very important
        [classes.pentaho]: isPentahoTheme,
        [classes.compact]: isCompactMode || !showVerticalNavigation,
      })}
      style={mergeStyles(style, {
        "--vNavWidth": `${verticalNavigationWidth}px`,
        "--headerHeight":
          showHeaderSubMenu && !isCompactMode
            ? `calc(${theme.header.height} + ${theme.header.secondLevelHeight})`
            : theme.header.height,
      })}
      {...others}
    >
      <Header />

      {showVerticalNavigation && <VerticalNavigation />}

      <main className={classes.main}>{children}</main>
    </div>
  );
}
