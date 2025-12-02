import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { HvAppShellEventNotificationTrigger } from "@hitachivantara/app-shell-events";

import * as BannerProvider from "../providers/BannerProvider";
import useNotificationsEventListenerHook from "./useNotificationsEventListener";

const mockedEnqueueSnackbar = vi.fn();
vi.mock("@hitachivantara/uikit-react-core", async () => {
  const mod = await vi.importActual("@hitachivantara/uikit-react-core");
  return {
    ...(mod as object),
    useHvSnackbar: () => {
      return {
        enqueueSnackbar: mockedEnqueueSnackbar,
      };
    },
  };
});

describe("useNotificationsEventListener Hook", () => {
  describe("Snackbar", () => {
    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should add a snackbar to show", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
            variant: "error",
            message: "dummyMessage",
          },
        }),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
            variant: "default",
            message: "dummyMessage2",
          },
        }),
      );

      expect(mockedEnqueueSnackbar).toHaveBeenNthCalledWith(1, "dummyMessage", {
        variant: "error",
      });
      expect(mockedEnqueueSnackbar).toHaveBeenNthCalledWith(
        2,
        "dummyMessage2",
        {
          variant: "default",
        },
      );
    });

    it("should use the default variant if no snackbar variant is provided", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
            message: "dummyMessage",
          },
        }),
      );
      expect(mockedEnqueueSnackbar).toHaveBeenNthCalledWith(1, "dummyMessage", {
        variant: "default",
      });
    });

    it("should not add a snackbar to show if no message is provided", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
          },
        }),
      );
      expect(mockedEnqueueSnackbar).not.toHaveBeenCalled();
    });

    it("should use only the first action to snackbar if more than one is passed", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
            message: "dummyMessage",
            actions: [
              {
                label: "Action 1",
                id: "action1",
              },
              {
                label: "Action 2",
                id: "action2",
              },
            ],
          },
        }),
      );
      expect(mockedEnqueueSnackbar).toHaveBeenNthCalledWith(1, "dummyMessage", {
        variant: "default",
        snackbarContentProps: {
          action: {
            label: "Action 1",
            id: "action1",
          },
          actionCallback: undefined,
        },
      });
    });

    it("should accept a react node instead of a array", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "snackbar",
            message: "dummyMessage",
            actions: <button type="button">Click me</button>,
          },
        }),
      );

      expect(mockedEnqueueSnackbar).toHaveBeenNthCalledWith(1, "dummyMessage", {
        variant: "default",
        snackbarContentProps: {
          action: <button type="button">Click me</button>,
          actionCallback: undefined,
        },
      });
    });
  });

  describe("Banner", () => {
    const mockedShow = vi.fn();

    beforeEach(() => {
      vi.spyOn(BannerProvider, "useBannerContext").mockImplementation(() => ({
        bannerMaxHeight: 0,
        show: mockedShow,
        dismiss: vi.fn(),
      }));
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("should add a banner to show", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "banner",
            variant: "error",
            message: "dummyMessage",
          },
        }),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "banner",
            variant: "default",
            message: "dummyMessage2",
          },
        }),
      );

      expect(mockedShow).toHaveBeenNthCalledWith(1, {
        variant: "error",
        message: "dummyMessage",
        type: "banner",
      });
      expect(mockedShow).toHaveBeenNthCalledWith(2, {
        variant: "default",
        message: "dummyMessage2",
        type: "banner",
      });
    });

    it("should use the default variant if no banner variant is provided", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "banner",
            message: "dummyMessage",
          },
        }),
      );
      expect(mockedShow).toHaveBeenNthCalledWith(1, {
        variant: undefined,
        message: "dummyMessage",
        type: "banner",
      });
    });

    it("should not add a banner to show if no message is provided", () => {
      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "banner",
          },
        }),
      );
      expect(mockedShow).not.toHaveBeenCalled();
    });
  });

  describe("Event detail", () => {
    const mockedShow = vi.fn();

    beforeEach(() => {
      vi.spyOn(BannerProvider, "useBannerContext").mockImplementation(() => ({
        bannerMaxHeight: 0,
        show: mockedShow,
        dismiss: vi.fn(),
      }));
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("Log to console if invalid notification type is provided", () => {
      const consoleMock = vi
        .spyOn(console, "warn")
        .mockImplementation(() => ({}));

      const { result: notificationsHook } = renderHook(() =>
        useNotificationsEventListenerHook(),
      );

      notificationsHook.current.handleNotificationEvent(
        new CustomEvent(HvAppShellEventNotificationTrigger, {
          detail: {
            type: "dummyType" as any,
            variant: "error",
            message: "dummyMessage",
          },
        }),
      );
      expect(consoleMock).toBeCalledWith(
        "Invalid notification type",
        "dummyType",
      );
    });
  });
});
