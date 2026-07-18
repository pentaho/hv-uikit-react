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
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvButton,
  HvInput,
  HvLogin,
  HvTypography,
  type HvLoginProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvLogin> = {
  title: "Components/Login",
  component: HvLogin,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", height: "100vh" }}>{Story()}</div>
    ),
  ],
};
export default meta;

export const Main: StoryObj<HvLoginProps> = {
  args: {},
  argTypes: {
    classes: { control: { disable: true } },
  },
  parameters: {
    ...setupChromatic("default", 5000),
  },
  render: () => {
    return (
      <HvLogin background="https://pentaho.github.io/assets/login-bg.png">
        <form
          className="grid gap-sm w-300px m-auto pt-150px"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            alert(JSON.stringify(Object.fromEntries(formData), null, 2));
          }}
        >
          <HvTypography variant="title2">Welcome</HvTypography>

          <HvInput
            required
            className="h-90px"
            name="username"
            label="Username"
            placeholder="Enter text"
          />

          <HvInput
            required
            className="h-90px"
            name="password"
            label="Password"
            placeholder="Enter text"
            type="password"
          />

          <HvButton
            type="submit"
            variant="primary"
            className="w-120px justify-self-end mt-sm"
          >
            Login
          </HvButton>
        </form>
      </HvLogin>
    );
  },
};
