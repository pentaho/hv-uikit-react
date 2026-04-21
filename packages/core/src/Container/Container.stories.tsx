import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvContainer,
  HvTypography,
  theme,
  useWidth,
  type HvContainerProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvContainer> = {
  title: "Components/Container",
  component: HvContainer,
};
export default meta;

export const Main: StoryObj<HvContainerProps> = {
  args: {
    maxWidth: "md",
    fixed: false,
    disableGutters: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    component: { control: { disable: true } },
  },
  render: (args) => {
    const classes = {
      content: css({
        border: "1px solid",
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.bgPageSecondary,
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }),
      row: css({
        display: "flex",
        flexDirection: "row",
      }),
    };

    const width = useWidth();

    return (
      <HvContainer {...args}>
        <div className={classes.content}>
          <div className={classes.row}>
            <HvTypography variant="label">Current width:</HvTypography>
            <HvTypography variant="body">{width}</HvTypography>
          </div>
          <div className={classes.row}>
            <HvTypography variant="label">maxWidth:</HvTypography>
            <HvTypography variant="body">{args.maxWidth}</HvTypography>
          </div>
        </div>
      </HvContainer>
    );
  },
};
