import { Helmet, HelmetProvider } from "react-helmet-async";
import { Global } from "@emotion/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-shared";
import HvAppShell from "@hitachivantara/app-shell-ui";
import { setupChromatic } from "@hitachivantara/internal";

const externalsEntries = [
  "react@18",
  "react-dom@18",
  "react-router-dom@6",
  "@emotion/react@11",
  "@emotion/cache@11",
  "@hitachivantara/app-shell-shared@1",
  "@hitachivantara/uikit-react-shared@5",
].map((mod) => {
  const pkg = mod.slice(0, mod.lastIndexOf("@"));
  const version = mod.slice(mod.lastIndexOf("@") + 1);
  return [pkg, `https://esm.sh/${pkg}@^${version}`];
});

const importMap = {
  imports: {
    ...Object.fromEntries(externalsEntries),
    "@hv/uikit-icons/": "/assets/",
    "@hv/sample-app/": "https://lumada-design.github.io/modules/sample-app/",
  },
};

export default {
  title: "Tests/AppShell",
  component: HvAppShell,
  // TODO: leverage the inlined importmap or separate AppShell UI from module loading
  decorators: [
    (Story) => (
      <HelmetProvider>
        <Helmet>
          <script type="importmap">{JSON.stringify(importMap, null, 2)}</script>
        </Helmet>
        <Global styles={{ ".hv-story-sample": { padding: "0 !important" } }} />
        <Story />
      </HelmetProvider>
    ),
  ],
} satisfies Meta;

export const Main: StoryObj<HvAppShellConfig> = {
  args: {
    name: "AppShell Test App",
    navigationMode: "TOP_AND_LEFT",
    logo: {
      name: "PENTAHO",
      description: "Logo Description",
    },
    menu: [
      { label: "Home", target: "/" },
      {
        label: "About",
        target: "/about",
        submenus: [
          { label: "Submenu 1", target: "/about/submenu1" },
          { label: "Submenu 2", target: "/about/submenu2" },
        ],
      },
      { label: "Other", target: "/other" },
    ],
    mainPanel: {
      views: [
        { bundle: "@hv/sample-app/pages/SecondPage.js", route: "/" },
        { bundle: "@hv/sample-app/pages/SecondPage.js", route: "/about" },
      ],
    },
  },
  argTypes: {},
  parameters: {
    ...setupChromatic("all", 5000),
  },
  play: async ({ canvas, userEvent }) => {
    const aboutLink = await canvas.findByRole("link", { name: /other/i });
    await userEvent.click(aboutLink);
  },
  render: (args, context) => {
    const [theme, colorMode] = context.globals.theme?.split(" ") || [];
    const config: HvAppShellConfig = {
      ...args,
      logo: {
        ...args.logo,
        name: theme === "pentaho" ? "PENTAHO" : "HITACHI",
      },
      navigationMode: theme === "pentaho" ? "ONLY_LEFT" : "TOP_AND_LEFT",
      theming: { theme, colorMode },
    };

    return <HvAppShell config={config} />;
  },
};
