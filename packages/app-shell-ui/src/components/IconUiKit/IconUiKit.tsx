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
