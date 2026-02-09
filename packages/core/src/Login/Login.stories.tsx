import { setupChromatic } from "@hitachivantara/internal";
import {
  HvButton,
  HvInput,
  HvLogin,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Login",
  component: HvLogin,
  decorators: [
    (Story) => (
      <div style={{ display: "flex", height: "100vh" }}>{Story()}</div>
    ),
  ],
});

export const Main = meta.story({
  args: {},
  argTypes: {
    classes: { control: { disable: true } },
  },
  parameters: {
    ...setupChromatic("default", 5000),
  },
  render: () => {
    return (
      <HvLogin background="https://lumada-design.github.io/assets/login-bg1.png">
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
});
