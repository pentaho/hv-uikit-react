import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBadge,
  HvButton,
  HvHeader,
  HvHeaderActions,
  HvHeaderBrand,
  HvHeaderNavigation,
  type HvHeaderProps,
} from "@hitachivantara/uikit-react-core";
import { Alert, Menu, User } from "@hitachivantara/uikit-react-icons";

const PentahoLogo = () => (
  <svg
    width="68px"
    viewBox="0 0 122 24"
    aria-label="Pentaho logo"
    fill="currentColor"
  >
    <path d="M113.089 6.20801C118.441 6.20814 122 10.0511 122 15.1045C122 20.1578 118.474 23.9999 113.089 24C107.703 24 104.147 20.1579 104.146 15.1045C104.146 10.0482 107.737 6.20801 113.089 6.20801ZM28.1318 6.1748C30.5152 6.1748 32.409 6.96369 33.8457 8.27637C35.8366 10.1157 36.8139 13.0365 36.7832 16.4502H24.7715C25.0992 18.715 26.3371 20.127 28.5244 20.127C29.9274 20.1269 30.8405 19.501 31.2998 18.4531H36.4893C36.1308 19.963 35.1501 21.4079 33.6826 22.4248C32.2796 23.4107 30.5827 23.9687 28.46 23.9688C22.9456 23.9688 19.5508 20.1264 19.5508 15.0391H19.5479C19.548 10.0168 23.0406 6.17495 28.1318 6.1748ZM76.1768 6.20801C78.6888 6.20803 80.3859 6.66766 81.5957 7.58594C83.0323 8.63656 83.7157 10.2786 83.7158 12.377V20.8477C83.7158 22.194 83.8473 22.9493 84.3037 23.2451V23.4736H79.1484C78.888 23.1131 78.7226 22.4561 78.5938 21.6025H78.5293C77.5491 23.0138 76.0814 23.9014 73.5664 23.9014C70.2365 23.9014 67.8565 22.0957 67.8564 18.7803H67.8535C67.8535 15.0704 70.7913 13.9552 74.25 13.4961C77.3837 13.1017 78.4932 12.7743 78.4932 11.625C78.493 10.5407 77.806 9.81934 76.207 9.81934C74.5101 9.81944 73.6614 10.5752 73.499 11.9863H68.6035C68.7351 8.86803 71.1161 6.20801 76.1768 6.20801ZM63.3496 6.66504H66.3857V10.0137H63.3496V17.8926C63.3496 19.2051 64.0666 19.5351 65.209 19.5352C65.6655 19.5352 66.1897 19.501 66.3857 19.501V23.4082C65.9292 23.5406 64.9181 23.6699 63.4814 23.6699C60.3812 23.6699 58.1602 22.6533 58.1602 19.042V10.0137H55.9424V6.66504H58.1602V1.34668H63.3496V6.66504ZM48.957 6.1748C52.6118 6.1748 54.7656 8.80029 54.7656 12.5439V23.4756H49.4443V13.6279C49.4443 11.8563 48.5626 10.6398 46.835 10.6396C45.1071 10.6396 43.8966 12.1153 43.8965 14.1855V23.4756H38.5752V6.66797H43.7031V8.96582H43.8018C45.0423 7.16049 46.6413 6.17492 48.957 6.1748ZM91.6133 8.73535H91.7119C92.9189 7.12704 94.3552 6.17491 96.6738 6.1748C100.329 6.1748 102.482 8.80029 102.482 12.5439V23.4756H97.1611V13.6279C97.1611 11.8563 96.2794 10.6398 94.5518 10.6396C92.8239 10.6396 91.6134 12.1153 91.6133 14.1855V23.4756H86.292V0.00292969H91.6133V8.73535ZM10.5107 0.00292969C13.3506 0.00293206 15.4402 0.791486 16.877 2.16895C18.3779 3.58019 19.2266 5.58307 19.2266 7.94629C19.2266 12.4449 16.1256 15.6279 11.3281 15.6279H5.87891V23.4727H0.00292969V0.00292969H10.5107ZM78.624 15.4648C77.9379 15.8253 76.9608 16.0878 75.8828 16.3525C73.8272 16.8117 72.9785 17.3383 72.9785 18.6172C72.9787 19.9634 73.9587 20.4873 75.2637 20.4873C77.2548 20.4873 78.6239 19.2733 78.624 17.4678V15.4648ZM113.058 9.9834C110.742 9.9835 109.532 12.0511 109.532 15.1045C109.532 18.1578 110.739 20.1913 113.058 20.1914C115.376 20.1914 116.614 18.155 116.614 15.1045C116.614 12.051 115.374 9.9834 113.058 9.9834ZM28.2305 9.9834C26.2056 9.9834 25.163 11.2647 24.8018 13.2646H31.3975C31.2014 11.262 29.9611 9.98355 28.2305 9.9834ZM5.87305 11.0332H10.1494C12.2387 11.0332 13.4121 9.78546 13.4121 7.91504C13.412 6.04481 12.2049 4.89551 10.1494 4.89551H5.87305V11.0332ZM0.00292969 0.00292969H0L0.00292969 0V0.00292969Z" />
  </svg>
);

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

export default {
  title: "Components/Header",
  component: HvHeader,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvHeaderBrand, HvHeaderNavigation, HvHeaderActions },
} satisfies Meta<typeof HvHeader>;

export const Main: StoryObj<HvHeaderProps> = {
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
          <HvHeaderBrand logo={<PentahoLogo />} name="Pentaho" />
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
};

export const Test: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <HvHeader position="relative">
        <HvHeaderBrand logo={<PentahoLogo />} name="Pentaho App" />
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
        <HvHeaderBrand name="Pentaho App" />
        <HvHeaderNavigation data={navigationDataMain} selected="3-1" />
      </HvHeader>
    </div>
  ),
};
