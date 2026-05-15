import { loadEnv } from "vite";
import type { HvAppShellConfig } from "@hitachivantara/app-shell-vite-plugin";

const {
  VITE_SAMPLE_APP_URL = "https://lumada-design.github.io/modules/sample-app/",
  VITE_USER_INFORMATION_URL = "http://localhost:8081/",
  VITE_USER_NOTIFICATIONS_URL = "http://localhost:8080/",
} = loadEnv(process.env.NODE_ENV, process.cwd());

export default {
  baseUrl: "/",
  apps: {
    "@hv/sample-app/": VITE_SAMPLE_APP_URL,
    "@hv/user-information-client/": VITE_USER_INFORMATION_URL,
    "@hv/user-notifications-client/": VITE_USER_NOTIFICATIONS_URL,
  },
  name: "App Shell",
  navigationMode: "TOP_AND_LEFT",
  logo: {
    name: "PENTAHO",
    description: "App Shell",
  },
  theming: {
    theme: "pentaho",
    colorMode: "light",
  },

  menu: [
    {
      label: "Default App",
      submenus: [
        {
          label: "asset",
          icon: {
            iconType: "uikit",
            name: "Desktop",
          },
          submenus: [
            {
              label: "asset",
              target: "/asset-inventory",
              icon: {
                iconType: "uikit",
                name: "Cards",
              },
            },
            {
              label: "list",
              target: "/list-view",
              icon: {
                iconType: "uikit",
                name: "List",
              },
            },
          ],
        },
        {
          label: "asset",
          target: "/asset-inventory",
          icon: {
            iconType: "uikit",
            name: "Cards",
          },
        },
        {
          label: "list",
          target: "/list-view",
          icon: {
            iconType: "uikit",
            name: "List",
          },
        },
        {
          label: "notifications",
          target: "/notifications",
          icon: { iconType: "unocss", name: "i-ph-bell" },
        },
        {
          label: "Multi-level Breadcrumb",
          target: "/breadcrumb",
        },
        {
          label: "Theming",
          target: "/theming",
          icon: {
            iconType: "uikit",
            name: "ColorPicker",
          },
        },
        ...Array.from(Array(16).keys()).map((i) => ({
          label: `Nested Views ${i + 1}`,
          target: `/nested-${i + 1}`,
        })),
        {
          label: "Services Demo",
          target: "/services-demo",
          icon: {
            iconType: "uikit",
            name: "Settings",
          },
        },
      ],
    },
    {
      label: "Providers Demo",
      target: "/providers-demo",
      icon: {
        iconType: "uikit",
        name: "Package",
      },
    },
    // ========================================
    // CONDITIONS EXAMPLES
    // Menus inherit conditions from matching views!
    // ========================================
    {
      label: "Conditions Demo",
      icon: {
        iconType: "uikit",
        name: "Eye",
      },
      submenus: [
        {
          label: "Sync True (Always Visible)",
          target: "/sync-true-demo",
          icon: {
            iconType: "uikit",
            name: "Check",
          },
        },
        {
          label: "Sync False (Always Hidden)",
          target: "/sync-false-demo",
          icon: {
            iconType: "uikit",
            name: "Close",
          },
        },
        {
          label: "Async True (0.5s delay)",
          target: "/async-true-demo",
          icon: {
            iconType: "uikit",
            name: "Clock",
          },
        },
        {
          label: "Async False (0.5s delay)",
          target: "/async-false-demo",
          icon: {
            iconType: "uikit",
            name: "ClockStop",
          },
        },
        {
          label: "Dynamic (Appears after 10s)",
          target: "/dynamic-condition-demo",
          icon: {
            iconType: "uikit",
            name: "Refresh",
          },
        },
        {
          label: "Sync True + Async True",
          target: "/multiple-conditions-demo",
          icon: {
            iconType: "uikit",
            name: "Hierarchy",
          },
        },
        {
          label: "Sync True + Sync False",
          target: "/multiple-fail-demo",
          icon: {
            iconType: "uikit",
            name: "Ban",
          },
        },
        {
          label: "Inverse Dynamic (view) + Async True",
          target: "/inverse-dynamic",
          icon: {
            iconType: "uikit",
            name: "Ban",
          },
          conditions: [
            {
              bundle: "$app/conditions/useAsyncTrue.js",
            },
          ],
        },
        {
          label: "Nested Submenus",
          icon: {
            iconType: "uikit",
            name: "Tree",
          },
          submenus: [
            {
              label: "Sync True",
              target: "/nested-visible",
            },
            {
              label: "Sync False",
              target: "/nested-hidden",
            },
            {
              label: "Async True",
              target: "/nested-async",
            },
          ],
        },
        // Menu entry that stays rendered if its submenus can render
        {
          label: "Disappearing Parent (10s)",
          icon: {
            iconType: "uikit",
            name: "Disappear",
          },
          submenus: [
            {
              label: "Inverse Dynamic Child",
              target: "/inverse-dynamic",
            },
          ],
        },
      ],
    },
    // Invalid menu entry without target and submenus (should never render)
    {
      label: "Invalid Menu Entry",
    },
    { label: "Debug", target: "/debug" },
    {
      label: "Not found",
      target: "/not-found",
    },
    {
      label: "Menu breadcrumb",
      target: "/breadcrumb",
    },
    {
      label: "Navigation",
      target: "/navigation",
    },
    { label: "Simple App Home", target: "/simple-app/home" },
  ],
  header: {
    actions: [
      {
        bundle: "$app/services/headerActions/CreateNewContentDropDownMenu.js",
      },
      // { bundle: "@hv/user-notifications-client/index.js", config: { showCount: false } },
      // { bundle: "@hv/user-information-client/index.js" },
      { bundle: "@hv/theming-client/colorModeSwitcher.js" },
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
              icon: { iconType: "unocss", name: "i-ph-warehouse" },
            },
            {
              label: "App 3",
              url: "#",
              target: "NEW",
            },
          ],
        },
      },
      {
        bundle: "@hv/help-client/button.js",
        config: {
          url: "https://www.hitachivantara.com/",
          description: "Hitachi Vantara Help Link",
        },
      },
      // { bundle: "@hv/sample-app/headerActions/HelloSimpleApp.js" },
      { bundle: "$app/modules/ChangeContextValue.js" },
      // { bundle: "@hv/sample-app/headerActions/ChangeDefaultAppContext.js" },
    ],
  },

  mainPanel: {
    views: [
      // Own application
      // TODO(major): remove @self/ support in favour of $app/
      { bundle: "@self/pages/Debug.js", route: "/debug" },
      {
        bundle: "$app/pages/AssetInventory.js",
        route: "/asset-inventory",
      },
      {
        bundle: "$app/pages/ListView.js",
        route: "/list-view",
      },
      {
        bundle: "$app/pages/Notifications.js",
        route: "/notifications",
        config: {
          initialNotificationText: "This is a test notification",
        },
      },
      {
        bundle: "$app/pages/Details.js",
        route: "/details/:cardId/:cardText",
      },
      {
        bundle: "$app/pages/Breadcrumb.js",
        route: "/breadcrumb",
      },
      {
        bundle: "$app/pages/Navigation.js",
        route: "/navigation",
      },
      {
        bundle: "$app/pages/Theming.js",
        route: "/theming",
      },
      {
        bundle: "$app/pages/DisplayDefaultAppContext.js",
        route: "/displayContext",
      },
      {
        bundle: "$app/pages/TabLayout.js",
        route: "/nested",

        maxWidth: "lg",

        views: [
          {
            bundle: "$app/pages/ListView.js",
            route: "/list-view",
          },
          {
            bundle: "$app/pages/AssetInventory.js",
            route: "/asset-inventory",
          },
          {
            bundle: "$app/pages/Theming.js",
            route: "/",
          },
        ],
      },
      // Simple App
      // { bundle: "@hv/sample-app/pages/Home.js", route: "/simple-app/home" },
      // Scoped Simple App
      // { bundle: "@hv/sample-app/pages/Home.js", route: "/scoped-home" },
      // Services Demo Page
      {
        bundle: "$app/pages/ServicesDemo.js",
        route: "/services-demo",
      },
      // Providers Demo Page
      {
        bundle: "$app/pages/ProvidersDemo.js",
        route: "/providers-demo",
      },

      // ========================================
      // CONDITIONS EXAMPLES - VIEWS
      // ========================================

      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/sync-true-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysTrue.js",
          },
        ],
      },

      // Example 2: Sync False - Never accessible (404)
      {
        bundle: "$app/pages/ShouldNotBeVisible.js",
        route: "/sync-false-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysFalse.js",
          },
        ],
      },

      // Example 3: Async True - Accessible after delay
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/async-true-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAsyncTrue.js",
          },
        ],
      },

      // Example 4: Async False - Not accessible (404 after delay)
      {
        bundle: "$app/pages/ShouldNotBeVisible.js",
        route: "/async-false-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAsyncFalse.js",
          },
        ],
      },

      // Example 5: Multiple conditions (both true)
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/multiple-conditions-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysTrue.js",
          },
          {
            bundle: "$app/conditions/useAsyncTrue.js",
          },
        ],
      },

      // Example 6: Multiple conditions (one false)
      {
        bundle: "$app/pages/ShouldNotBeVisible.js",
        route: "/multiple-fail-demo",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysTrue.js",
          },
          {
            bundle: "$app/conditions/useAlwaysFalse.js",
          },
        ],
      },

      // Example 7: Inverse dynamic (false after 10s)
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/inverse-dynamic",
        conditions: [
          {
            bundle: "$app/conditions/useFlipToFalse.js",
          },
        ],
      },

      // Nested menu views
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/nested-visible",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysTrue.js",
          },
        ],
      },
      {
        bundle: "$app/pages/ShouldNotBeVisible.js",
        route: "/nested-hidden",
        conditions: [
          {
            bundle: "$app/conditions/useAlwaysFalse.js",
          },
        ],
      },
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/nested-async",
        conditions: [
          {
            bundle: "$app/conditions/useAsyncTrue.js",
          },
        ],
      },

      // Dynamic condition example - appears after 10 seconds
      {
        bundle: "$app/pages/ShouldBeVisible.js",
        route: "/dynamic-condition-demo",
        conditions: [
          {
            bundle: "$app/conditions/useFlipToTrue.js",
          },
        ],
      },
    ],
  },
  providers: [
    {
      bundle: "$app/providers/DefaultAppProvider.js",
      // Always visible provider (no conditions)
    },
    {
      bundle: "$app/providers/AsyncProvider.js",
      conditions: [{ bundle: "$app/conditions/useAsyncTrue.js" }],
    },
    {
      bundle: "$app/providers/HiddenProvider.js",
      conditions: [{ bundle: "$app/conditions/useAlwaysFalse.js" }],
    },
    {
      bundle: "$app/providers/DynamicProvider.js",
      conditions: [{ bundle: "$app/conditions/useFlipToTrue.js" }],
    },
  ],
  services: {
    // Instance Service (bundle) - Basic hooks service consumed by ServicesDemo page and CreateNewContentDropDownMenu header action
    "$app/services:UseCreateNewContentAction": [
      {
        instance: {
          bundle: "$app/services/create/useCreateNewReportAction.js",
        },
        ranking: 100,
        conditions: [
          {
            bundle: "$app/conditions/useFlipToFalse.js",
          },
        ],
      },
      {
        instance: {
          bundle: "$app/services/create/useCreateNewDashboardAction.js",
        },
        conditions: [
          {
            bundle: "$app/conditions/useAsyncTrue.js",
          },
        ],
      },
    ],

    // Instance Service (direct values) - Simple configuration data
    "$app/services:SimpleDataService": [
      {
        instance: {
          value: {
            appName: "Default App",
            version: "1.0.0",
            environment: "development",
            debug: true,
          },
        },
        ranking: 100,
      },
    ],

    // Factory Service (bundle) - Message service
    "$app/services:MessageService": [
      {
        factory: {
          bundle: "$app/services/factories/createMessageService.js",
          config: {
            prefix: "App Message: ",
          },
        },
      },
    ],

    // Component Service (bundle) - Basic notification component
    "$app/services:BasicNotification": [
      {
        component: {
          bundle: "$app/services/components/NotificationComponent.js",
          config: {
            message: "Service is active!",
          },
        },
        ranking: 100,
      },
    ],
  },
} satisfies HvAppShellConfig;
