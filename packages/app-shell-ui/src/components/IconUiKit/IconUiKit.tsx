import { memo } from "react";
import {
  icons,
  type HvIconSpriteProps,
} from "@hitachivantara/uikit-react-icons";

export interface IconUiKitProps extends Omit<
  HvIconSpriteProps,
  "iconName" | "spriteUrl"
> {
  name: string;
}

const IconUiKit = ({ name, ...others }: IconUiKitProps) => {
  // eslint-disable-next-line import/namespace
  const Icon = icons[name as keyof typeof icons];
  if (!Icon) return null;

  return <Icon {...others} />;
};

export default memo(IconUiKit);
