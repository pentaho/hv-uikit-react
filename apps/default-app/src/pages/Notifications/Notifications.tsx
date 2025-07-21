import { useState } from "react";
import {
  HvAppShellEventNotification,
  HvAppShellEventNotificationTrigger,
  HvAppShellEventNotificationType,
} from "@hitachivantara/app-shell-events";
import {
  HvBannerVariant,
  HvButton,
  HvCheckBox,
  HvGlobalActions,
  HvGrid,
  HvInput,
  HvSnackbarVariant,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

const Notifications = () => {
  const [notificationText, setNotificationText] = useState("");
  const [includeActions, setIncludeActions] = useState(false);

  const renderTriggerNotificationButton = (
    type: HvAppShellEventNotificationType,
    variant: HvBannerVariant | HvSnackbarVariant,
  ) => {
    const actionsProps: Partial<HvAppShellEventNotification> = includeActions
      ? {
          actions: [
            { label: "Action 1", id: "action1" },
            { label: "Action 2", id: "action2" },
          ],
          onAction: (evt, action) => {
            // eslint-disable-next-line no-restricted-globals
            history.pushState(
              "",
              "",
              `${window.location.pathname}?action=${action.id}`,
            );
          },
        }
      : {};

    const triggerNotificationHandler = () => {
      const customEvent = new CustomEvent<HvAppShellEventNotification>(
        HvAppShellEventNotificationTrigger,
        {
          detail: {
            type,
            variant,
            message: notificationText,
            ...actionsProps,
          },
        },
      );
      globalThis.dispatchEvent(customEvent);
    };

    return (
      <HvButton
        aria-label={`Trigger ${type} ${variant}`}
        type="button"
        variant="secondarySubtle"
        disabled={notificationText.length === 0}
        onClick={triggerNotificationHandler}
      >
        {variant}
      </HvButton>
    );
  };

  return (
    <>
      <HvGlobalActions title="Notifications" className="mb-xs" />

      <HvGrid container className="mb-xs">
        <HvGrid item xs={12}>
          <HvInput
            type="text"
            label="Notification text"
            value={notificationText}
            onChange={(event) => setNotificationText(event.target.value)}
          />
          <HvCheckBox
            label="Include actions"
            checked={includeActions}
            onChange={() => setIncludeActions((old) => !old)}
          />
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="center">
          <HvTypography variant="title3">Snackbars</HvTypography>
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="space-evenly">
          {renderTriggerNotificationButton("snackbar", "default")}
          {renderTriggerNotificationButton("snackbar", "success")}
          {renderTriggerNotificationButton("snackbar", "warning")}
          {renderTriggerNotificationButton("snackbar", "error")}
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="center">
          <HvTypography variant="title3">Banners</HvTypography>
        </HvGrid>

        <HvGrid item xs={12} display="flex" justifyContent="space-evenly">
          {renderTriggerNotificationButton("banner", "default")}
          {renderTriggerNotificationButton("banner", "success")}
          {renderTriggerNotificationButton("banner", "warning")}
          {renderTriggerNotificationButton("banner", "error")}
        </HvGrid>
      </HvGrid>
    </>
  );
};

export default Notifications;
