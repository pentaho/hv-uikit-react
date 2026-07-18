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
import type { HvBannerProps } from "@hitachivantara/uikit-react-core";

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
