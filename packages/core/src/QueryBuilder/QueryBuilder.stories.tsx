import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@pentaho/internal";
import {
  HvQueryBuilder,
  type HvQueryBuilderProps,
} from "@pentaho/uikit-react-core";

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
