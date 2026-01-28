import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import { Expandable as ExpandableStory } from "./stories/Expandable";
import { KPICards as KPICardsStory } from "./stories/KPICards";
import { Main as MainStory } from "./stories/Main";
import { Selectable as SelectableStory } from "./stories/Selectable";
import { Variants as VariantsStory } from "./stories/Variants";

const meta = preview.meta({
  title: "Components/Card",
  component: HvCard,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvCardHeader, HvCardContent, HvCardMedia },
  decorators: [(Story) => <div style={{ margin: 20 }}>{Story()}</div>],
});

export const Main = meta.story({
  args: {
    bgcolor: "bgContainer",
    statusColor: "negative",
    selectable: false,
    selected: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    icon: { control: { disable: true } },
  },
  render: (args) => <MainStory {...args} />,
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story: `The \`Card\` component can be constructed by composing several sub-components, like \`HvCardHeader\`, \`HvCardContent\`, \`HvCardMedia\`, and \`HvActionsBar\`. 
        This sample showcases how these modular pieces can be combined to create a wide variety of card layouts and styles.`,
      },
    },
  },
  render: () => <VariantsStory />,
});

export const KPICards = meta.story({
  render: () => <KPICardsStory />,
});

export const Selectable = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A card sample showcasing the ability to select in the content and click action.",
      },
    },
  },
  render: () => <SelectableStory />,
});

export const Expandable = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "A card sample showcasing the ability to expand a card and show hidden content.",
      },
    },
  },
  render: () => <ExpandableStory />,
});
