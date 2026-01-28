import { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import {
  DocsContainer,
  DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import { addons } from "storybook/preview-api";
import {
  HvProvider,
  HvThemeColorMode,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { getInitialMode } from "../decorators/utils";
import { themes } from "../theme";

const components = {
  a: (props) => <HvTypography link component="a" {...props} />,
  p: (props) => <HvTypography component="p" {...props} />,
  li: (props) => <li {...props} />,
  h1: (props) => <HvTypography component="h1" variant="title1" {...props} />,
  h2: (props) => <HvTypography component="h2" variant="title2" {...props} />,
  h3: (props) => <HvTypography component="h3" variant="title3" {...props} />,
  h4: (props) => <HvTypography component="h4" variant="title4" {...props} />,
  h5: (props) => <HvTypography component="h5" variant="title4" {...props} />,
  h6: (props) => <HvTypography component="h6" variant="title4" {...props} />,
} as const satisfies Record<string, React.ComponentType>;

export default ({
  context,
  children,
}: {
  children?: React.ReactNode;
  context: DocsContainerProps["context"];
}) => {
  const initialMode = getInitialMode();
  const [mode, setMode] = useState(initialMode);

  const switchMode = (mode: HvThemeColorMode) => {
    setMode(mode);
  };

  useEffect(() => {
    const ADDON_EVENT = "MODE_SELECT";
    const channel = addons.getChannel();
    channel.on(ADDON_EVENT, switchMode);

    return () => {
      channel.off(ADDON_EVENT, switchMode);
    };
  }, []);

  return (
    <MDXProvider components={components}>
      <HvProvider
        classNameKey="hv-storybook"
        cssTheme="scoped"
        colorMode={mode}
      >
        <DocsContainer theme={themes[mode]} context={context}>
          {children}
        </DocsContainer>
      </HvProvider>
    </MDXProvider>
  );
};
