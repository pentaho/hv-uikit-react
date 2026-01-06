import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvQueryBuilder,
  HvQueryBuilderProps,
} from "@hitachivantara/uikit-react-core";

import { CustomRenderers as CustomRenderersStory } from "./stories/CustomRenderers";
import { Main as MainStory } from "./stories/Main";
import { ReadOnly as ReadOnlyStory } from "./stories/ReadOnly";

const meta: Meta<typeof HvQueryBuilder> = {
  title: "Components/Query Builder",
  component: HvQueryBuilder,
};
export default meta;

export const Main: StoryObj<HvQueryBuilderProps> = {
  args: { disableConfirmation: false },
  argTypes: {
    classes: { control: { disable: true } },
    attributes: { control: { disable: true } },
    combinators: { control: { disable: true } },
    labels: { control: { disable: true } },
    onChange: { control: { disable: true } },
    renderers: { control: { disable: true } },
    operators: { control: { disable: true } },
  },
  parameters: {
    docs: {},
    ...setupChromatic(),
  },
  render: (args) => {
    return <MainStory {...args} />;
  },
};

export const ReadOnly: StoryObj<HvQueryBuilderProps> = {
  parameters: {
    docs: {
      description: {
        story: "Query builder in read only mode.",
      },
    },
    ...setupChromatic(),
  },
  render: () => <ReadOnlyStory />,
};

export const CustomRenderers: StoryObj<HvQueryBuilderProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "If the default attribute types (`boolean`, `numeric`, `text`, `textarea`, and `dateandtime`) are not enough to cover your use case, custom ones can be used. For these custom types, if no corresponding renderer is provided through the `renderers` property, a text input will be rendered. The `renderers` property can also be used to customize the value renderers for specific operators of an attribute type.",
      },
    },
  },
  render: () => <CustomRenderersStory />,
};
