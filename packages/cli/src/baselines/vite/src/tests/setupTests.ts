import "@testing-library/jest-dom";
import type { TransProps } from "react-i18next";
import type { ThirdPartyModule, TOptionsBase } from "i18next";
import { vi } from "vitest";

vi.mock("react-i18next", async () => {
  const { initReactI18next } = await vi.importActual<{
    initReactI18next: ThirdPartyModule;
  }>("react-i18next");

  const t = (str: string, options?: TOptionsBase) =>
    options?.returnObjects ? undefined : str;

  return {
    initReactI18next,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Trans: ({ i18nKey }: TransProps<any>) => i18nKey,
    useTranslation: () => ({
      t,
      i18n: { changeLanguage: async () => t },
    }),
  };
});
