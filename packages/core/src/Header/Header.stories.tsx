import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  HvBadge,
  HvButton,
  HvHeader,
  HvHeaderActions,
  HvHeaderBrand,
  HvHeaderNavigation,
} from "@hitachivantara/uikit-react-core";
import { Alert, Menu, User } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";
import { HitachiLogo } from "./stories/HitachiLogo";

const navigationDataMain = [
  {
    id: "1",
    label: "Overview",
    data: [
      {
        id: "1-1",
        label: "Model Effectiveness 1",
        href: "/overview/model-effectiveness",
      },
      {
        id: "1-2",
        label: "Trend Analysis 1-2",
        href: "/overview/trend-analysis",
      },
    ],
  },
  {
    id: "2",
    label: "Events",
    href: "/events",
  },
  {
    id: "3",
    label: "Work Orders",
    data: [
      {
        id: "3-1",
        label: "Model Effectiveness 3-1",
        href: "/work-orders/model-effectiveness",
      },
      {
        id: "3-2",
        label: "Trend Analysis 3-2",
        href: "/work-orders/trend-analysis",
      },
    ],
  },
  {
    id: "4",
    label: "Assets",
    href: "/assets",
  },
  {
    id: "5",
    label: "Analytics",
    data: [
      {
        id: "5-1",
        label: "Model Effectiveness 5-1",
        href: "/analytics/model-effectiveness",
      },
      {
        id: "5-2",
        label: "Trend Analysis 5-2",
        href: "/analytics/trend-analysis",
      },
    ],
  },
];

const meta = preview.meta({
  title: "Components/Header",
  component: HvHeader,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvHeaderBrand, HvHeaderNavigation, HvHeaderActions },
});

export const Main = meta.story({
  args: {
    position: "relative",
  },
  argTypes: {
    classes: { control: { disable: true } },
    position: {
      control: "select",
    },
  },
  decorators: [(Story) => <div style={{ height: 150 }}>{Story()}</div>],
  render: ({ position }) => {
    const [selected, setSelected] = useState("2");
    const muiTheme = useTheme();
    const isLgUp = useMediaQuery(muiTheme.breakpoints.up("lg"));

    return (
      <div style={{ minHeight: 100 }}>
        <HvHeader position={position}>
          {!isLgUp && (
            <HvButton
              style={{ width: 32, height: 32 }}
              icon
              onClick={() => console.log("menu")}
              aria-label="Menu"
            >
              <Menu />
            </HvButton>
          )}
          <HvHeaderBrand logo={<HitachiLogo />} name="Lumada App" />
          {isLgUp && (
            <HvHeaderNavigation
              data={navigationDataMain}
              selected={selected}
              onClick={(event, selectedItem) => {
                if (selectedItem.href) {
                  setSelected(selectedItem.id);
                } else if (selectedItem.data?.length) {
                  setSelected(selectedItem.data[0].id);
                }
              }}
            />
          )}

          <HvHeaderActions>
            <HvButton
              icon
              onClick={() => console.log("alerts")}
              aria-label="Open Notifications panel"
            >
              <HvBadge label={1} icon={<Alert />} />
            </HvButton>
            {isLgUp && (
              <HvButton onClick={() => {}} aria-label="Open User panel" icon>
                <User />
              </HvButton>
            )}
          </HvHeaderActions>
        </HvHeader>
      </div>
    );
  },
});

export const Test = meta.story({
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <HvHeader position="relative">
        <HvHeaderBrand logo={<HitachiLogo />} name="Lumada App" />
        <HvHeaderNavigation data={navigationDataMain} />
        <HvHeaderActions>
          <HvButton icon aria-label="Open Notifications panel">
            <HvBadge label={1} icon={<Alert />} />
          </HvButton>
          <HvButton onClick={() => {}} aria-label="Open User panel" icon>
            <User />
          </HvButton>
        </HvHeaderActions>
      </HvHeader>

      <HvHeader position="relative">
        <HvHeaderBrand name="Lumada App" />
        <HvHeaderNavigation data={navigationDataMain} selected="3-1" />
      </HvHeader>
    </div>
  ),
});
