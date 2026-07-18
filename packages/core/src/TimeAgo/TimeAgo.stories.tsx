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
import { useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvRadio,
  HvRadioGroup,
  HvTimeAgo,
  theme,
  type HvTimeAgoProps,
} from "@hitachivantara/uikit-react-core";

const styles = {
  container: css({
    minHeight: 300,
    "& > div": {
      padding: theme.spacing("xs"),
    },
  }),
  table: css({
    border: `1px solid ${theme.colors.text}`,
    borderCollapse: "collapse",
    "& th, td": {
      border: `1px solid ${theme.colors.text}`,
      padding: theme.spacing("5px", "sm"),
    },
  }),
};

const meta: Meta<typeof HvTimeAgo> = {
  title: "Components/Time Ago",
  component: HvTimeAgo,
};
export default meta;

export const Main: StoryObj<HvTimeAgoProps> = {
  args: {
    timestamp: Date.now(),
    locale: "en",
    disableRefresh: false,
    showSeconds: false,
    justText: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    component: { control: { disable: true } },
    ref: { control: { disable: true } },
  },
  render: (args) => {
    return <HvTimeAgo {...args} />;
  },
};

const dates = [
  new Date(),
  new Date().setSeconds(new Date().getSeconds() - 10),
  new Date().setSeconds(new Date().getSeconds() - 90),
  new Date().setMinutes(new Date().getMinutes() - 1),
  new Date().setMinutes(new Date().getMinutes() - 10),
  new Date().setMinutes(new Date().getMinutes() - 59),
  new Date().setMinutes(new Date().getMinutes() - 80),
  new Date().setHours(0),
  new Date().setDate(new Date().getDate() - 1),
  new Date().setDate(0),
  new Date().setMonth(new Date().getMonth() - 1),
  new Date().setSeconds(new Date().getSeconds() + 90),
  new Date().setMinutes(new Date().getMinutes() + 5),
  new Date().setHours(23, 59, 59, 999),
  new Date().setDate(new Date().getDate() + 1),
  new Date().setMonth(new Date().getMonth() + 6),
].map((date) => date.valueOf());

export const LocaleOverride: StoryObj<HvTimeAgoProps> = {
  parameters: {
    docs: {
      description: {
        story: "Sample dates and locale controlled externally.",
      },
    },
  },
  render: () => {
    const [locale, setLocale] = useState("en");

    return (
      <div className={css(styles.container)}>
        <div>
          <HvRadioGroup
            orientation="horizontal"
            value={locale}
            onChange={async (event, newLocale) => {
              // dynamically import locales. if the supported locales are known beforehand,
              // its preferable to import them statically, to avoid bundling unnecessary locales
              setLocale(newLocale);
            }}
          >
            <HvRadio label="🇬🇧 English" value="en" />
            <HvRadio label="🇫🇷 French" value="fr" />
            <HvRadio label="🇩🇪 German" value="de" />
            <HvRadio label="🇵🇹 Portuguese" value="pt" />
            <HvRadio label="🇯🇵 Japanese" value="ja" />
          </HvRadioGroup>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ISO Date</th>
              <th>{"<TimeAgo />"}</th>
            </tr>
          </thead>
          <tbody>
            {dates.map((dateTs) => (
              <tr key={dateTs}>
                <td>{new Date(dateTs).toISOString()}</td>
                <td aria-label="Time ago">
                  <HvTimeAgo timestamp={dateTs} locale={locale} showSeconds />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
