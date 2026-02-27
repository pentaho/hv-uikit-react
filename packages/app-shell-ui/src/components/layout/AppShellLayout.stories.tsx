import { ErrorBoundary } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { HvAppShellConfig } from "@hitachivantara/app-shell-shared";
import { setupChromatic } from "@hitachivantara/internal";
import { HvButton } from "@hitachivantara/uikit-react-core";

import { createI18Next } from "../../i18n";
import GenericError from "../../pages/GenericError";
import NotFound from "../../pages/NotFound";
import { LayoutProvider } from "../../providers/LayoutProvider";
import { NavigationProvider } from "../../providers/NavigationProvider";
import { HvAppShellProvider } from "../AppShellProvider/AppShellProvider";
import { HvAppShellLayout } from "./AppShellLayout";
import { BrandLogo } from "./BrandLogo/BrandLogo";

const i18n = createI18Next();

const ProviderDecorator: Decorator = (Story, context) => {
  return (
    <TestProvider config={{ theming: parseTheme(context.globals.theme) }}>
      <Story />
    </TestProvider>
  );
};

const BoundaryDecorator: Decorator = (Story) => (
  <ErrorBoundary fallback={null}>
    <Story />
  </ErrorBoundary>
);

export default {
  title: "Tests/AppShell Layout",
  tags: ["skipTestRunner"],
} satisfies Meta;

export const Main: StoryObj = {
  parameters: {
    ...setupChromatic("light", 5000),
  },
  globals: { viewport: { value: "split" } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await canvas.findByRole("link", { name: /about/i }));
    await userEvent.click(
      await canvas.findByRole("button", { name: /submenu 2/i }),
    );
    await userEvent.click(await canvas.findByRole("button", { name: /apps/i }));
  },
  render: (args, context) => {
    return (
      <TestProvider
        config={{
          name: "App Shell Test",
          logo: { name: "PENTAHO" },
          navigationMode: "TOP_AND_LEFT",
          theming: parseTheme(context.globals.theme),
          menu: [
            { label: "Home", target: "/" },
            {
              label: "About",
              target: "/about",
              submenus: [
                { label: "Submenu 1", target: "/about/submenu1" },
                {
                  label: "Submenu 2",
                  target: "/about/submenu2",
                  submenus: [
                    {
                      label: "Submenu 2.1",
                      target: "/about/submenu2/submenu1",
                      icon: { iconType: "uikit", name: "Upload" },
                    },
                    {
                      label: "Submenu 2.2",
                      target: "/about/submenu2/submenu2",
                      // TODO: add uno icon
                      // icon: { iconType: "uno", name: "i-ph-upload" },
                    },
                  ],
                },
                { label: "Submenu 3", target: "/about/submenu3" },
              ],
            },
            { label: "Other", target: "/other" },
          ],
          header: {
            actions: [
              { bundle: "@hv/theming-client/colorModeSwitcher.js" },
              {
                bundle: "@hv/help-client/button.js",
                config: {
                  url: "https://www.hitachivantara.com/",
                  description: "Hitachi Vantara Help Link",
                },
              },
              {
                bundle: "@hv/app-switcher-client/toggle.js",
                config: {
                  title: "Apps",
                  apps: [
                    {
                      label: "App 1",
                      description: "Application 1",
                      url: "#",
                      target: "NEW",
                      icon: { iconType: "uikit", name: "Dummy" },
                    },
                    {
                      label: "App 2",
                      description: "Application 2",
                      url: "#",
                      target: "SELF",
                      icon: { iconType: "uikit", name: "Upload" },
                    },
                    {
                      label: "App 3",
                      description: "Application 3",
                      url: "#",
                      target: "SELF",
                      // TODO: add uno icon
                      // icon: { iconType: "uno", name: "i-ph-upload" },
                    },
                    {
                      label: "App 4",
                      url: "#",
                      target: "NEW",
                    },
                  ],
                },
              },
            ],
          },
        }}
      >
        <HvAppShellLayout className="h-300px">
          <div className="flex flex-col gap-sm items-start p-sm">
            <HvButton variant="primarySubtle">Test</HvButton>
            <BrandLogo logo={{ name: "HITACHI" }} />
            <BrandLogo logo={{ name: "LUMADA" }} />
            <BrandLogo logo={{ name: "PENTAHO" }} />
            <BrandLogo logo={{ name: "PENTAHO+" }} />
          </div>
        </HvAppShellLayout>
      </TestProvider>
    );
  },
};

export const ErrorPage: StoryObj = {
  parameters: {
    ...setupChromatic("light", 5000),
  },
  globals: { viewport: { value: "split" } },
  decorators: [ProviderDecorator, BoundaryDecorator],
  render: () => (
    <div className="grid gap-sm">
      <NotFound />
      <GenericError />
    </div>
  ),
};

function TestProvider({
  config,
  children,
}: {
  config: HvAppShellConfig;
  children: React.ReactNode;
}) {
  return (
    <HelmetProvider>
      <I18nextProvider i18n={i18n}>
        <LayoutProvider>
          <MemoryRouter>
            <HvAppShellProvider config={config}>
              <NavigationProvider>{children}</NavigationProvider>
            </HvAppShellProvider>
          </MemoryRouter>
        </LayoutProvider>
      </I18nextProvider>
    </HelmetProvider>
  );
}

function parseTheme(themeArg: any) {
  const [theme, mode] = String(themeArg).split(" ");
  const colorMode = mode === "dark" ? "dark" : "light";
  return { theme, colorMode } as const;
}
