import preview from "../../../../../.storybook/preview";
import { HvInfoMessage } from "./InfoMessage";

const meta = preview.meta({
  title: "Components/Form Element Blocks/Info Message",
  component: HvInfoMessage,
});

export const Main = meta.story({
  args: {
    disabled: false,
    disableGutter: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return <HvInfoMessage {...args}>Info Message</HvInfoMessage>;
  },
});

export const DisabledInfoMessage = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Info message showcasing the disabled state.",
      },
    },
  },
  render: () => {
    return (
      <HvInfoMessage id="infoMessage-disabled" disabled>
        Info message
      </HvInfoMessage>
    );
  },
});
