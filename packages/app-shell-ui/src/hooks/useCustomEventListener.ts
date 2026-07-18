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
import { useEffect } from "react";
import {
  HvAppShellEventNotificationTrigger,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";

import useNotificationsEventListener from "./useNotificationsEventListener";
import useThemeEventListener from "./useThemeEventListener";

const useCustomEventListener = () => {
  const { handleNotificationEvent } = useNotificationsEventListener();
  const { handleThemeEvent } = useThemeEventListener();

  useEffect(() => {
    globalThis.addEventListener(
      HvAppShellEventNotificationTrigger,
      handleNotificationEvent as EventListener,
    );
    globalThis.addEventListener(
      HvAppShellEventThemeTrigger,
      handleThemeEvent as EventListener,
    );

    return () => {
      globalThis.removeEventListener(
        HvAppShellEventNotificationTrigger,
        handleNotificationEvent as EventListener,
      );
      globalThis.removeEventListener(
        HvAppShellEventThemeTrigger,
        handleThemeEvent as EventListener,
      );
    };
  }, [handleNotificationEvent, handleThemeEvent]);
};

export default useCustomEventListener;
