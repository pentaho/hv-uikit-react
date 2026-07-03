import { useState } from "react";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationTree,
  type HvVerticalNavigationProps,
} from "@hitachivantara/uikit-react-core";
import { LogOut, User } from "@hitachivantara/uikit-react-icons";

const navigationData = [
  { id: "00", label: "Overview" },
  { id: "01", label: "Analytics" },
  {
    id: "02",
    label: "Storage",
    data: [
      {
        id: "02-01",
        label: "Cloud",
        data: [
          {
            id: "02-01-01",
            label: "Servers",
            href: "https://example.com/servers.html",
          },
          {
            id: "02-01-02",
            label: "HCP Anywhere",
          },
          {
            id: "02-01-03",
            label: "This Computer",
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    id: "03",
    label: "Administration",
    href: "#admin",
    data: [
      {
        id: "03-01",
        label: "Rest API",
        href: "#admin-rest",
        data: [
          {
            id: "03-01-01",
            label: "Log Bundle",
            href: "#admin-rest-logs",
          },
        ],
      },
    ],
  },
];

export const Main = (props: HvVerticalNavigationProps) => {
  const [value, setValue] = useState("00");

  return (
    <HvVerticalNavigation {...props}>
      <HvVerticalNavigationTree
        aria-label="Example 1 navigation"
        selected={value}
        onChange={(event, data) => {
          if (data.id === "02-01-01") {
            event.preventDefault();
            event.stopPropagation();
          }
          setValue(data.id);
        }}
        data={navigationData}
      />
      <HvVerticalNavigationActions>
        <HvVerticalNavigationAction label="Profile" icon={<User />} />
        <HvVerticalNavigationAction label="Logout" icon={<LogOut />} />
      </HvVerticalNavigationActions>
    </HvVerticalNavigation>
  );
};
