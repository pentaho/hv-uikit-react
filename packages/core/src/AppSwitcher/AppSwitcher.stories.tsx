/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvAppSwitcher,
  type HvAppSwitcherActionApplication,
  type HvAppSwitcherProps,
} from "@hitachivantara/uikit-react-core";
import { Code, LeftAlign } from "@hitachivantara/uikit-react-icons";

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

const meta: Meta<typeof HvAppSwitcher> = {
  title: "Components/App Switcher",
  component: HvAppSwitcher,
};
export default meta;

export const Main: StoryObj<HvAppSwitcherProps> = {
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
};

export const ManyEntries: StoryObj<HvAppSwitcherProps> = {
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
};
