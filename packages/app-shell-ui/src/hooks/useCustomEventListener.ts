import { useEffect } from "react";
import {
  HvAppShellEventNotificationTrigger,
  HvAppShellEventThemeTrigger,
} from "@pentaho/app-shell-events";

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
