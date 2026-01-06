import { HvAppShellEventNotification } from "@hitachivantara/app-shell-events";
import { useHvSnackbar } from "@hitachivantara/uikit-react-core";

import { useBannerContext } from "../providers/BannerProvider";

const useNotificationsEventListener = () => {
  const { enqueueSnackbar } = useHvSnackbar();
  const { show } = useBannerContext();

  const handleCustomEventSnackbar = (
    notification: HvAppShellEventNotification,
  ) => {
    const { message, variant, actions, onAction } = notification;

    let snackbarContentProps;
    if (actions) {
      snackbarContentProps = {
        action: Array.isArray(actions) ? actions[0] : actions,
        onAction,
      };
    }

    if (message) {
      enqueueSnackbar(message, {
        variant: variant ?? "default",

        snackbarContentProps,
      });
    }
  };

  const handleCustomEventBanner = (
    notification: HvAppShellEventNotification,
  ) => {
    if (notification.message) {
      show(notification);
    }
  };

  const handleNotificationEvent = (
    event: CustomEvent<HvAppShellEventNotification>,
  ) => {
    const notificationEvent = event.detail;
    switch (notificationEvent.type) {
      case "snackbar":
        handleCustomEventSnackbar(notificationEvent);
        break;
      case "banner":
        handleCustomEventBanner(notificationEvent);
        break;
      default:
        console.warn("Invalid notification type", notificationEvent.type);
    }
  };

  return { handleNotificationEvent };
};

export default useNotificationsEventListener;
