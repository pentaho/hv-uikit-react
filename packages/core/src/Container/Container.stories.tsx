import { css } from "@emotion/css";
import {
  HvContainer,
  HvTypography,
  theme,
  useWidth,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Container",
  component: HvContainer,
});

export const Main = meta.story({
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
});
