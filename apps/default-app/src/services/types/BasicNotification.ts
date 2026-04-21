import type { FC } from "react";
import type { HvTypographyVariants } from "@hitachivantara/uikit-react-core";

export interface NotificationComponentProps {
  message: string;
  variant?: HvTypographyVariants;
}

export type BasicNotification = FC<NotificationComponentProps>;
