import {
  HvOverflowTooltip,
  HvSnackbar,
  HvSnackbarContent,
} from "@hitachivantara/uikit-react-core";
import { Deploy, Info } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Snackbar",
  component: HvSnackbar,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvSnackbarContent },
  decorators: [(Story) => <div style={{ minHeight: 60 }}>{Story()}</div>],
  args: {
    offset: 20,
  },
});

export const Main = meta.story({
  args: {
    open: true,
    variant: "default",
    label: "This is a snackbar",
    offset: 20,
    transitionDirection: "left",
    showIcon: true,
    transitionDuration: 300,
    autoHideDuration: 5000,
  },
  argTypes: {
    classes: { control: { disable: true } },
    anchorOrigin: { control: { disable: true } },
    customIcon: { control: { disable: true } },
    action: { control: { disable: true } },
    onAction: { control: { disable: true } },
    snackbarContentProps: { control: { disable: true } },
  },
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "All the different Snackbar variants and some examples of Snackbar's with custom icons, actions and content.",
      },
    },
  },
  args: {
    open: true,
    offset: 0,
    className: "relative mb-10px",
  },
  render: (props) => {
    return (
      <>
        <HvSnackbar
          {...props}
          variant="default"
          label="This is a default snackbar."
        />
        <HvSnackbar
          {...props}
          variant="success"
          showIcon
          label="This is a success message."
        />
        <HvSnackbar
          {...props}
          variant="warning"
          showIcon
          label="This is a warning message."
        />
        <HvSnackbar
          {...props}
          variant="error"
          showIcon
          label="This is an error message."
        />
        <HvSnackbar
          {...props}
          variant="success"
          label="This is a snackbar with a custom icon."
          customIcon={<Deploy />}
        />
        <HvSnackbar
          {...props}
          variant="success"
          title="Title"
          label="This is a snackbar with a title."
          customIcon={<Deploy />}
        />
        <HvSnackbar
          {...props}
          label="This is a snackbar with a custom action."
          customIcon={<Info />}
          action={{ id: "post", label: "Action", disabled: false }}
          onAction={(evt, action) => console.log(action)}
        />
        <HvSnackbar
          {...props}
          label="This is a very very very very very long multi-line snackbar message displaying wrapping text."
        />
        <HvSnackbar
          {...props}
          label={
            <HvOverflowTooltip data="This message uses HvOverflowTooltip to display ellipsis and a tooltip." />
          }
        />
        <HvSnackbar
          {...props}
          label={
            <HvOverflowTooltip
              paragraphOverflow
              data="This message uses HvOverflowTooltip with paragraphOverflow to display ellipsis and a tooltip because it has a very very very very very very very very very very long text that takes more than 3 lines."
            />
          }
        />
      </>
    );
  },
});
