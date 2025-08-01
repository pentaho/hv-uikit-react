import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import {
  HvAppShellEventTheme,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";

import { LOCAL_STORAGE_KEYS } from "./useLocalStorage";
import useThemeEventListenerHook from "./useThemeEventListener";

const mockedChangeMode = vi.fn();
vi.mock("@hitachivantara/uikit-react-core", async () => {
  const mod = await vi.importActual("@hitachivantara/uikit-react-core");
  return {
    ...mod,
    useTheme: () => {
      return {
        changeMode: mockedChangeMode,
        selectedMode: "dummyColor1",
        colorModes: [
          "dummyColor1",
          "dummyColor2",
          "dummyColor3",
          "dummyColor4",
        ],
      };
    },
  };
});

describe("useThemeEventListener Hook", () => {
  afterEach(() => {
    vi.resetAllMocks();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.COLOR_MODE);
  });

  it("should call `changeTheme` with selectedTheme and the new colorMode, the new color should be stored in the localStorage", () => {
    const { result: themeEventListenerHook } = renderHook(() =>
      useThemeEventListenerHook(),
    );

    themeEventListenerHook.current.handleThemeEvent(
      new CustomEvent<HvAppShellEventTheme>(HvAppShellEventThemeTrigger, {
        detail: { colorMode: "dummyColor3" },
      }),
    );

    expect(mockedChangeMode).toHaveBeenCalledWith("dummyColor3");
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.COLOR_MODE)).toBe(
      "dummyColor3",
    );
  });

  it("should call `changeTheme` with selectedTheme and the second color in the array when none is provided, the color should also be stored in the localStorage", () => {
    const { result: themeEventListenerHook } = renderHook(() =>
      useThemeEventListenerHook(),
    );

    themeEventListenerHook.current.handleThemeEvent(
      new CustomEvent<HvAppShellEventTheme>(HvAppShellEventThemeTrigger, {
        detail: {},
      }),
    );

    expect(mockedChangeMode).toHaveBeenCalledWith("dummyColor2");
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.COLOR_MODE)).toBe(
      "dummyColor2",
    );
  });

  it("should call `changeTheme` with selectedTheme and the second color in the array when a non existent color is used", () => {
    const { result: themeEventListenerHook } = renderHook(() =>
      useThemeEventListenerHook(),
    );

    themeEventListenerHook.current.handleThemeEvent(
      new CustomEvent<HvAppShellEventTheme>(HvAppShellEventThemeTrigger, {
        detail: { colorMode: "wrongColor" },
      }),
    );

    expect(mockedChangeMode).toHaveBeenCalledWith("dummyColor2");
    expect(localStorage.getItem(LOCAL_STORAGE_KEYS.COLOR_MODE)).toBe(
      "dummyColor2",
    );
  });
});
