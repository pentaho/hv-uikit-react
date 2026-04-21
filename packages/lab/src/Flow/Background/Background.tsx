import { Background, type BackgroundProps } from "reactflow";
import { getColor, theme, type HvColorAny } from "@hitachivantara/uikit-styles";

export interface HvFlowBackgroundProps extends Omit<BackgroundProps, "color"> {
  /** Color for the background dots. Defaults to `text`. */
  color?: HvColorAny;
}

export const HvFlowBackground = ({
  color = "text",
  ...others
}: HvFlowBackgroundProps) => {
  return (
    <Background
      color={getColor(color, theme.colors.textSubtle)}
      gap={16}
      {...others}
    />
  );
};
