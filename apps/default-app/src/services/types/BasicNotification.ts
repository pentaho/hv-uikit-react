import type { FC } from "react";
import type { HvTypographyVariants } from "@pentaho/uikit-react-core";

export interface NotificationComponentProps {
  message: string;
  variant?: HvTypographyVariants;
}

export type BasicNotification = FC<NotificationComponentProps>;
