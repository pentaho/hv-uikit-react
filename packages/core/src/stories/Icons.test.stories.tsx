import { setupChromatic } from "@hitachivantara/internal";
import {
  CheckboxCheck,
  HvIconSprite,
  HvIconSpriteProps,
  icons,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Tests/Icons",
});

const SpriteCheckbox = (props: Partial<HvIconSpriteProps>) => (
  <HvIconSprite
    spriteUrl="./assets/icons.svg"
    iconName="CheckboxCheck"
    {...props}
  />
);

export const Test = meta.story({
  parameters: {
    ...setupChromatic(),
  },
  render: () => {
    return (
      <div className="grid gap-xs">
        <div className="flex flex-wrap">
          {Object.entries(icons).map(([name, Icon]) => (
            <Icon
              key={name}
              color={["text", "negative", "positive"]}
              size="md"
            />
          ))}
        </div>

        <div className="flex">
          <CheckboxCheck size="XS" />
          <SpriteCheckbox size="XS" />
          <CheckboxCheck size="S" />
          <SpriteCheckbox size="S" />
          <CheckboxCheck size="M" />
          <SpriteCheckbox size="M" />
          <CheckboxCheck size="L" />
          <SpriteCheckbox size="L" />
          <CheckboxCheck />
          <SpriteCheckbox />
          <CheckboxCheck size="md" />
          <SpriteCheckbox size="md" />
          <CheckboxCheck size={120} />
          <SpriteCheckbox size={120} />
        </div>

        <div className="flex">
          <CheckboxCheck size={100} style={{ width: 140, height: 140 }} />
          <CheckboxCheck size={100} />
        </div>
      </div>
    );
  },
});
