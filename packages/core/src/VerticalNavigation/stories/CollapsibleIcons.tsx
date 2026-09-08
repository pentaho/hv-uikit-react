import { useState } from "react";
import {
  HvVerticalNavigation,
  HvVerticalNavigationAction,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
} from "@pentaho/uikit-react-core";
import {
  BarChart,
  Deploy,
  LogOut,
  Open,
  User,
} from "@pentaho/uikit-react-icons";

const navigationData = [
  { id: "00", label: "Installation Overview", icon: <Open /> },
  {
    id: "01",
    label: "Hardware",
    icon: <BarChart />,
    data: [
      { id: "01-01", label: "Ambient Monitoring", icon: <BarChart /> },
      { id: "01-02", label: "Server Status Summary" },
    ],
  },
  {
    id: "02",
    label: "System",
    icon: <Deploy />,
    data: [
      { id: "02-01", label: "Buckets", icon: <Deploy /> },
      { id: "02-02", label: "Admin Users" },
      {
        id: "02-03",
        label: "Log Bundle",
        data: [
          { id: "02-03-01", label: "Rest API" },
          { id: "02-03-02", label: "License" },
        ],
      },
    ],
  },
  {
    id: "03",
    label: "System 2",
    data: [
      { id: "03-01", label: "Buckets" },
      { id: "03-02", label: "Admin Users" },
      {
        id: "03-03",
        label: "Log Bundle",
        data: [
          { id: "03-03-01", label: "Rest API" },
          { id: "03-03-02", label: "License" },
        ],
      },
    ],
  },
];

export const CollapsibleIcons = () => {
  const [value, setValue] = useState("01-01");
  const [show, setShow] = useState(false);

  return (
    <HvVerticalNavigation open={show} useIcons>
      <HvVerticalNavigationHeader
        title="Menu"
        onCollapseButtonClick={() => setShow(!show)}
        collapseButtonProps={{
          "aria-label": "collapseButton",
          "aria-expanded": show,
        }}
      />
      <HvVerticalNavigationTree
        collapsible
        defaultExpanded
        aria-label="Example 3 navigation"
        selected={value}
        onChange={(event, data) => setValue(data.id)}
        data={navigationData}
      />
      <HvVerticalNavigationActions>
        <HvVerticalNavigationAction label="Profile" icon={<User />} />
        <HvVerticalNavigationAction label="Logout" icon={<LogOut />} />
      </HvVerticalNavigationActions>
    </HvVerticalNavigation>
  );
};
