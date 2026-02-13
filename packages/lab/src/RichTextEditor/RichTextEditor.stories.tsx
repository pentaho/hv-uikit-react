import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvButton,
  HvSection,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  HvRichTextEditor,
  HvRichTextEditorProps,
} from "@hitachivantara/uikit-react-lab";

const meta: Meta<typeof HvRichTextEditor> = {
  title: "Lab/RichTextEditor",
  component: HvRichTextEditor,
};
export default meta;

const dummyMentionsData = [
  "alice",
  "bob",
  "charlie",
  "dave",
  "eve",
  "frank",
  "grace",
  "heidi",
  "ivan",
  "judy",
  "mallory",
  "nina",
  "olivia",
  "peter",
  "quinn",
  "rachel",
  "sam",
  "trudy",
  "victor",
  "wendy",
  "xander",
  "yvonne",
  "zara",
];

export const Main: StoryObj<HvRichTextEditorProps> = {
  args: {},
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvSection
        expandable
        style={{ width: 600 }}
        title={
          <HvTypography variant="title4">My cool Rich Text Editor</HvTypography>
        }
        actions={
          <>
            <HvButton variant="secondarySubtle">Cancel</HvButton>
            <HvButton>Save</HvButton>
          </>
        }
      >
        <HvRichTextEditor
          mentionItems={dummyMentionsData}
          mentionSearchFunction={(items, searchString, callback) => {
            setTimeout(() => {
              const results = items.filter((mention) =>
                mention.toLowerCase().startsWith(searchString.toLowerCase()),
              );
              callback(results);
            }, 300);
          }}
          style={{ minHeight: 400, maxHeight: 600, overflow: "scroll" }}
          {...args}
        />
      </HvSection>
    );
  },
};
