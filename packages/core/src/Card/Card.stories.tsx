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
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  type HvCardProps,
} from "@hitachivantara/uikit-react-core";

import { Expandable as ExpandableStory } from "./stories/Expandable";
import { KPICards as KPICardsStory } from "./stories/KPICards";
import { Main as MainStory } from "./stories/Main";
import { Selectable as SelectableStory } from "./stories/Selectable";
import { Variants as VariantsStory } from "./stories/Variants";

const meta: Meta<typeof HvCard> = {
  title: "Components/Card",
  component: HvCard,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvCardHeader, HvCardContent, HvCardMedia },
  decorators: [(Story) => <div style={{ margin: 20 }}>{Story()}</div>],
};
export default meta;

export const Main: StoryObj<HvCardProps> = {
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
};

export const Variants: StoryObj<HvCardProps> = {
  parameters: {
    docs: {
      description: {
        story: `The \`Card\` component can be constructed by composing several sub-components, like \`HvCardHeader\`, \`HvCardContent\`, \`HvCardMedia\`, and \`HvActionsBar\`. 
        This sample showcases how these modular pieces can be combined to create a wide variety of card layouts and styles.`,
      },
    },
  },
  render: () => <VariantsStory />,
};

export const KPICards: StoryObj<HvCardProps> = {
  render: () => <KPICardsStory />,
};

export const Selectable: StoryObj<HvCardProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "A card sample showcasing the ability to select in the content and click action.",
      },
    },
  },
  render: () => <SelectableStory />,
};

export const Expandable: StoryObj<HvCardProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "A card sample showcasing the ability to expand a card and show hidden content.",
      },
    },
  },
  render: () => <ExpandableStory />,
};
