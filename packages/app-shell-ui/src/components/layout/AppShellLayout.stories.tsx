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
import AppSwitcherToggle from "./HeaderActions/AppSwitcherToggle/AppSwitcherToggle";
import ColorModeSwitcher from "./HeaderActions/ColorModeSwitcher";
import HelpButton from "./HeaderActions/HelpButton/HelpButton";

const i18n = createI18Next();

const ProviderDecorator: Decorator = (Story) => (
  <TestProvider config={{}}>
    <Story />
  </TestProvider>
);

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
    ...setupChromatic("pentaho light", 5000),
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
    const [theme, mode] = String(context.globals.theme).split(" ");
    return (
      <TestProvider
        config={{
          name: "App Shell Test",
          logo: { name: "PENTAHO" },
          navigationMode: "TOP_AND_LEFT",
          theming: { theme, colorMode: mode === "dark" ? "dark" : "light" },
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
          <div className="bg-negativeSubtle p-xs">
            <HvButton variant="primarySubtle">Test</HvButton>
          </div>
        </HvAppShellLayout>
      </TestProvider>
    );
  },
};

export const Header: StoryObj = {
  parameters: {
    ...setupChromatic("pentaho light", 5000),
  },
  decorators: [ProviderDecorator],
  render: () => (
    <div className="flex gap-sm">
      <BrandLogo logo={{ name: "HITACHI" }} />
      <BrandLogo logo={{ name: "LUMADA" }} />
      <BrandLogo logo={{ name: "PENTAHO" }} />
      <BrandLogo logo={{ name: "PENTAHO+" }} />

      <ColorModeSwitcher />
      <HelpButton url="https://google.com" description="alt" />
      <AppSwitcherToggle title="Apps" apps={[]} />
    </div>
  ),
};

export const NotFoundPage: StoryObj = {
  name: "NotFound",
  parameters: {
    ...setupChromatic("pentaho light", 5000),
  },
  globals: { viewport: { value: "split" } },
  decorators: [ProviderDecorator, BoundaryDecorator],
  render: () => <NotFound />,
};

export const GenericErrorPage: StoryObj = {
  name: "GenericError",
  parameters: {
    ...setupChromatic("pentaho light", 5000),
  },
  globals: { viewport: { value: "split" } },
  decorators: [ProviderDecorator, BoundaryDecorator],
  render: () => <GenericError />,
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
