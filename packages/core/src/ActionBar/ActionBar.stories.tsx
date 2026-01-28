import { HvActionBar, HvButton, theme } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Action Bar",
  component: HvActionBar,
  decorators: [
    (Story) => (
      <div className="relative m-auto bg-bgContainer h-150px w-400px flex items-end">
        {Story()}
      </div>
    ),
  ],
});

export const Main = meta.story({
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => (
    <HvActionBar style={{ gap: theme.space.xs }}>
      <HvButton variant="secondaryGhost">Help</HvButton>
      <div style={{ flex: 1 }} aria-hidden="true" />
      <HvButton variant="secondaryGhost">Save</HvButton>
      <HvButton variant="secondaryGhost">Cancel</HvButton>
    </HvActionBar>
  ),
});
