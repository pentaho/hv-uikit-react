import type { HvBannerProps } from "@pentaho/uikit-react-core";

export const HvAppShellEventNotificationTrigger =
  "@hv/app-shell:notifications:trigger";

export type HvAppShellEventNotificationType = "snackbar" | "banner";

export interface HvAppShellEventNotification extends Pick<
  HvBannerProps,
  "actions" | "variant" | "message" | "onAction"
> {
  type: HvAppShellEventNotificationType;
  message?: string;
}
