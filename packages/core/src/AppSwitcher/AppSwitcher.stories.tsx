import {
  HvAppSwitcher,
  HvAppSwitcherActionApplication,
} from "@hitachivantara/uikit-react-core";
import { Code, LeftAlign } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const applicationsList: HvAppSwitcherActionApplication[] = [
  {
    name: "UI Kit Storybook",
    color: "#FF4785",
    iconUrl:
      "https://pbs.twimg.com/profile_images/1100804485616566273/sOct-Txm_400x400.png",
    description: "This is the Storybook for the UI Kit project",
    url: "https://lumada-design.github.io/uikit/",
    target: "_top",
  },
  {
    name: "UI Kit repository (New Tab)",
    iconElement: <Code />,
    description: "This is the UI Kit repository on Github",
    url: "https://github.com/pentaho/hv-uikit-react/",
    target: "_blank",
  },
  {
    name: "App with a bigger name than the other just to showcase the truncation on the AppSwitcher",
    color: "primary",
    iconElement: <LeftAlign color="primary" />,
    description: "App 1 description",
  },
  {
    name: "No Icon App",
    color: "primary",
    description: "This is a disabled App without an icon",
    disabled: true,
  },
  {
    name: "No Description App",
    color: "primary",
  },
];

const meta = preview.meta({
  title: "Components/App Switcher",
  component: HvAppSwitcher,
});

export const Main = meta.story({
  args: {
    layout: "single",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvAppSwitcher
        title="My Apps"
        applications={applicationsList}
        isActionSelectedCallback={(application) =>
          application.url != null &&
          window.location.href.startsWith(application.url)
        }
        onActionClickedCallback={(event, application) => {
          if (!application.url) {
            alert(`The clicked application was: ${application.name}`);
          }
        }}
        footer="And this is a footer"
        {...args}
      />
    );
  },
});

export const ManyEntries = meta.story({
  render: () => {
    const dummyApplicationsList = [
      ...Array(100).keys(),
    ].map<HvAppSwitcherActionApplication>((index) => ({
      id: `app_${index}`,
      name:
        index % 3 === 0
          ? `Application ${index} is an application with a big name`
          : `Application ${index}`,
      description:
        index % 5 === 0
          ? `This is the auto-generated application number ${index}`
          : undefined,
      url: "https://github.com/pentaho/hv-uikit-react",
      target: index % 2 === 0 ? "_top" : "_blank",
    }));

    return (
      <HvAppSwitcher
        className="max-h-370px"
        layout="dual"
        title="Big list of applications"
        applications={dummyApplicationsList}
        isActionSelectedCallback={(application) =>
          window.location.href.startsWith(application.url || "")
        }
      />
    );
  },
});
