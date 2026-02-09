import {
  HvIconButton,
  HvPanel,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Close } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Panel",
  component: HvPanel,
});

export const Main = meta.story({
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    return (
      <HvPanel>
        <HvTypography>Panel Content</HvTypography>
      </HvPanel>
    );
  },
});

export const WithScroll = meta.story({
  render: () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";

    return (
      <HvPanel className="w-[300px] h-[300px] overflow-auto p-sm" tabIndex={0}>
        {[...Array(50).keys()].map((i) => (
          <div key={i}>
            {i === 0 ? chars : `Line ${i}: ${chars[i % chars.length]}`}
          </div>
        ))}
      </HvPanel>
    );
  },
});

export const Modal = meta.story({
  render: () => {
    return (
      <HvPanel
        style={{
          width: "100%",
          height: "200px",
          boxShadow: theme.colors.shadow,
        }}
      >
        <HvTypography>Panel Content</HvTypography>
        <HvIconButton
          title="Close"
          style={{
            position: "absolute",
            top: theme.space.sm,
            right: theme.space.sm,
          }}
        >
          <Close />
        </HvIconButton>
      </HvPanel>
    );
  },
});
