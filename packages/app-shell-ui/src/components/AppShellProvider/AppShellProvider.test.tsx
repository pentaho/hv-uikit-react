import { act, render, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellConfig,
} from "@hitachivantara/app-shell-shared";

import * as i18next from "../../i18n";
import TestProvider from "../../tests/TestProvider";
import renderTestProvider from "../../tests/testUtils";

const addResourceBundlesMock = vi.spyOn(i18next, "addResourceBundles");
const consoleMock = vi.spyOn(console, "error").mockImplementation(() => ({}));

describe("AppShellProvider component", () => {
  beforeEach(() => {
    consoleMock.mockReset();
  });
  describe("rendering", () => {
    const DummyComponent = () => {
      const test = useHvAppShellConfig();
      return <p>{test?.name}</p>;
    };
    const mockedConfigResponse = {
      name: "fromConfigParameter",
      translations: {
        en: {
          fromFile: "fromConfigUrlParameter-translated",
        },
      },
    };

    it("should use the values passed trough the config parameter", async () => {
      const { queryByText } = await renderTestProvider(
        <DummyComponent />,
        mockedConfigResponse,
      );

      expect(queryByText("fromConfigParameter")).toBeInTheDocument();
      expect(queryByText("fromConfigUrlParameter")).not.toBeInTheDocument();
    });

    it("should use the values loaded from the passed through the configUrl parameter", async () => {
      const fetchMock = vi.fn();
      global.fetch = fetchMock;
      fetchMock.mockImplementation(() =>
        Promise.resolve({
          json: () => ({
            name: "fromConfigUrlParameter",
          }),
        }),
      );

      const { queryByText } = await act(async () =>
        render(
          <TestProvider configUrl="http://dummy.url">
            <DummyComponent />
          </TestProvider>,
        ),
      );

      expect(queryByText("fromConfigParameter")).not.toBeInTheDocument();
      expect(queryByText("fromConfigUrlParameter")).toBeInTheDocument();
    });

    it("should add config translations correctly", async () => {
      await renderTestProvider(<DummyComponent />, mockedConfigResponse);

      expect(addResourceBundlesMock).toHaveBeenCalledWith(
        expect.anything(),
        {
          en: {
            fromFile: "fromConfigUrlParameter-translated",
          },
        },
        CONFIG_TRANSLATIONS_NAMESPACE,
      );
    });
  });

  describe("config theming prop", () => {
    it("should log error if import of a theme bundle fails and apply default", async () => {
      const { baseElement } = await renderTestProvider(<div>dummy</div>, {
        theming: {
          theme: "dummyTheme",
        },
      });

      const bodyElement = baseElement.ownerDocument.body;

      await waitFor(() => {
        expect(consoleMock).toHaveBeenCalledWith(
          expect.stringContaining("Import of theme bundle dummyTheme failed!"),
        );

        expect(bodyElement.getAttribute("data-theme")).toBe("ds5");
      });
    });

    it("should apply chosen theme and color mode", async () => {
      const { baseElement } = await renderTestProvider(<div>dummy</div>, {
        theming: {
          theme: "ds5",
          colorMode: "dark",
        },
      });

      const bodyElement = baseElement.ownerDocument.body;

      await waitFor(() => {
        expect(bodyElement.getAttribute("data-theme")).toBe("ds5");
        expect(bodyElement.getAttribute("data-color-mode")).toBe("dark");
        expect(bodyElement).toHaveStyle("color-scheme: dark;");
      });
    });
  });

  describe("config providers prop", () => {
    it("should log error if import of a provider bundle fails and still render correctly", async () => {
      const { queryByText } = await renderTestProvider(<div>dummy</div>, {
        providers: [
          {
            bundle: "dummyProvider",
          },
        ],
      });

      await waitFor(() => {
        expect(consoleMock).toHaveBeenCalledWith(
          expect.stringContaining("Import of provider 'dummyProvider' failed!"),
        );
      });

      expect(queryByText("dummy")).toBeInTheDocument();
    });
  });
});
