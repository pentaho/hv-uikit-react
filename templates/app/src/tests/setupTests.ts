import type { TransProps } from "react-i18next";
import type { ThirdPartyModule } from "i18next";
import { vi } from "vitest";

import "@testing-library/jest-dom";

/** The English translations, by namespace (the file's name): tests render the real text. */
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<Record<string, unknown>>(
      "../../public/locales/en/*.json",
      {
        eager: true,
        import: "default",
      },
    ),
  ).map(([file, json]) => [file.replace(/^.*\/|\.json$/g, ""), json]),
);

/** `t` for a namespace: a dotted key's English text, or the key when it has none. */
const translate = (ns: string) => (key: string) => {
  const text = key
    .split(".")
    .reduce<unknown>(
      (node, part) => (node as Record<string, unknown> | undefined)?.[part],
      messages[ns],
    );
  return typeof text === "string" ? text : key;
};

vi.mock("react-i18next", async () => {
  const { initReactI18next } = await vi.importActual<{
    initReactI18next: ThirdPartyModule;
  }>("react-i18next");

  return {
    initReactI18next,
    Trans: ({ i18nKey }: TransProps<any>) => i18nKey,
    I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
    useTranslation: (ns = "common") => ({
      t: translate(ns),
      i18n: { changeLanguage: async () => undefined },
    }),
  };
});
