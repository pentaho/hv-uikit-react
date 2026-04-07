import { useState } from "react";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationTree,
  type HvVerticalNavigationTreeProps,
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
            label: "Very long hitachivantara.com hyperlink",
            href: "https://www.hitachivantara.com/en-us/news.html",
          },
          { id: "02-01-02", label: "HCP Anywhere" },
          { id: "02-01-03", label: "This Computer", disabled: true },
        ],
      },
    ],
  },
  {
    id: "03",
    label: "Administration",
    data: [...Array(6).keys()].map((i) => ({
      id: `03-${i}`,
      label: `Admin panel ${i}`,
      href: `#admin-${i}`,
    })),
  },
];

export const Test = (props: HvVerticalNavigationTreeProps) => {
  const { selected: selectedProp = "00", ...others } = props;
  const [selected, setSelected] = useState(selectedProp);

  return (
    <HvVerticalNavigation>
      <HvVerticalNavigationTree
        selected={selected ?? "00"}
        aria-label="Example 1 navigation"
        data={navigationData}
        onChange={(evt, data) => setSelected(data.id)}
        {...others}
      />
      <HvVerticalNavigationActions>
        <HvVerticalNavigationAction label="Profile" icon={<User />} />
        <HvVerticalNavigationAction label="Logout" icon={<LogOut />} />
      </HvVerticalNavigationActions>
    </HvVerticalNavigation>
  );
};
