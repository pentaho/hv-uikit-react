import fs from "node:fs";
import { vi } from "vitest";
import { HvAppShellConfig } from "@hitachivantara/app-shell-shared";

import {
  findAppShellConfigFile,
  getAppModules,
  getBasePath,
  getFinalModuleName,
  loadConfigFile,
} from "../config-utils";

vi.mock("path", async () => vi.importActual("./mocks/path.mock.ts"));

const jitiMock = vi.hoisted(() => ({
  import: vi.fn(),
}));
vi.mock("jiti", () => ({
  createJiti: () => jitiMock,
}));

const existsSyncMock = vi.fn();
const readFileSyncMock = vi.fn();
fs.existsSync = existsSyncMock;
fs.readFileSync = readFileSyncMock;
describe("test app-shell-vite-generate-base plugin", () => {
  describe("test `findAppShellConfigFile`", () => {
    it("returns the config file location (and its content) if exists", () => {
      existsSyncMock.mockImplementation((file: string) => {
        return file.match("/dummyPath/dummyRootProject/app-shell.config.json");
      });
      const filePath = findAppShellConfigFile("/dummyPath/dummyRootProject");
      expect(filePath).toBe(
        "/dummyPath/dummyRootProject/app-shell.config.json",
      );
    });

    it("returns undefined if config file don't exists", () => {
      existsSyncMock.mockImplementation(() => {
        return false;
      });
      const filePath = findAppShellConfigFile("/dummyPath/dummyRootProject");
      expect(filePath).toBeUndefined();
    });
  });

  describe("test `loadConfigFile`", () => {
    it("returns an empty config if the config file is not defined", async () => {
      const appShellConfig = await loadConfigFile(undefined, {}, {});
      expect(appShellConfig).toMatchObject({});
    });

    it("returns the config if config file exists", async () => {
      const config: HvAppShellConfig = {
        baseUrl: "dummyBaseUrl",
      };

      existsSyncMock.mockImplementation((file: string) => {
        return file.match("/dummyPath/dummyRootProject/app-shell.config.json");
      });

      readFileSyncMock.mockImplementation(() => {
        return JSON.stringify(config);
      });

      const appShellConfig = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.json",
        {},
        {},
      );
      expect(appShellConfig).toMatchObject(config);
    });

    it("replaces tokens at configurations defined at json files", async () => {
      const config: HvAppShellConfig = {
        baseUrl: "@@BASE_URL@@",
      };

      existsSyncMock.mockImplementation((file: string) => {
        return file.match("/dummyPath/dummyRootProject/app-shell.config.json");
      });

      readFileSyncMock.mockImplementation(() => {
        return JSON.stringify(config);
      });

      const appShellConfig = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.json",
        {
          configReplacements: [
            { token: "BASE_URL", value: "dummyBaseUrlWithTokens" },
          ],
        },
        {},
      );
      expect(appShellConfig).toMatchObject({
        baseUrl: "dummyBaseUrlWithTokens",
      });
    });

    it("loads a .ts config with a plain object default export", async () => {
      const config: HvAppShellConfig = { baseUrl: "dummyBaseUrl" };

      jitiMock.import.mockResolvedValue(config);

      const result = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.ts",
        {},
        {},
      );
      expect(result).toMatchObject(config);
    });

    it("forwards env to a .ts config function", async () => {
      jitiMock.import.mockResolvedValue(
        (_opts: unknown, env: Record<string, string>) => ({
          baseUrl: env.APP_BASE ?? "/",
        }),
      );

      const result = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.ts",
        {},
        { APP_BASE: "http://env-base.example.com" },
      );
      expect(result).toMatchObject({ baseUrl: "http://env-base.example.com" });
    });

    it("forwards opts to a .ts config function", async () => {
      jitiMock.import.mockResolvedValue(
        (opts: { configReplacements?: { value: string }[] }) => ({
          baseUrl: opts.configReplacements?.[0]?.value ?? "/",
        }),
      );

      const result = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.ts",
        {
          configReplacements: [
            { token: "BASE", value: "http://opts-base.example.com" },
          ],
        },
        {},
      );
      expect(result).toMatchObject({ baseUrl: "http://opts-base.example.com" });
    });

    it("supports sync config functions returning HvAppShellConfig", async () => {
      jitiMock.import.mockResolvedValue(
        (_opts: unknown, env: Record<string, string>) => ({
          baseUrl: env.APP_BASE ?? "/",
        }),
      );

      const result = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.ts",
        {},
        { APP_BASE: "http://sync-base.example.com" },
      );
      expect(result).toMatchObject({ baseUrl: "http://sync-base.example.com" });
    });

    it("supports async config functions returning Promise<HvAppShellConfig>", async () => {
      jitiMock.import.mockResolvedValue(
        async (_opts: unknown, env: Record<string, string>) => ({
          baseUrl: env.APP_BASE ?? "/",
        }),
      );

      const result = await loadConfigFile(
        "/dummyPath/dummyRootProject/app-shell.config.ts",
        {},
        { APP_BASE: "http://async-base.example.com" },
      );
      expect(result).toMatchObject({
        baseUrl: "http://async-base.example.com",
      });
    });

    it("propagates errors thrown by jiti during .ts config loading", async () => {
      jitiMock.import.mockRejectedValue(new Error("config loading error"));

      await expect(
        loadConfigFile(
          "/dummyPath/dummyRootProject/app-shell.config.ts",
          {},
          {},
        ),
      ).rejects.toThrow("config loading error");
    });
  });

  describe("getFinalModuleName", () => {
    it("removes leading 'src/' and file extension from module path", () => {
      const modulePath = "/src/pages/DummyPath.tsx";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath");
    });

    it("replaces '$' with '_' in the module path", () => {
      const modulePath = "/src/pages/DummyPath/$id/HelloWorld.tsx";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath/_id/HelloWorld");
    });

    it("handles module paths without 'src/' prefix", () => {
      // this use case is not expected to happen, but let's test it anyway

      const modulePath = "/other/pages/DummyPath.tsx";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("other/pages/DummyPath");
    });

    it("handles module paths without file extension", () => {
      const modulePath = "/src/pages/DummyPath";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath");
    });

    it("handles module paths with '.ts' file extension", () => {
      const modulePath = "/src/pages/DummyPath.ts";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath");
    });

    it("handles module paths with '.jsx' file extension", () => {
      const modulePath = "/src/pages/DummyPath.jsx";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath");
    });

    it("handles module paths with '.tsx' file extension", () => {
      const modulePath = "/src/pages/DummyPath.tsx";
      const finalModuleName = getFinalModuleName(modulePath);
      expect(finalModuleName).toBe("pages/DummyPath");
    });
  });

  describe("getAppModules", () => {
    it("modules are correctly mapped", () => {
      expect(
        getAppModules("dummyPath", [
          "src/pages/DummyPath",
          "src/pages/DummyPath-2",
          "src/pages/DummyPath/$id/HelloWorld",
          "src/modules/DummyModule1",
          "src/modules/DummyModule2.ts",
          "src/modules/DummyModule3.tsx",
          "src/modules/DummyModule4.js",
          "src/modules/DummyModule5.jsx",
          "altSrc/customModules/DummyAltSource",
          "altSrc/customModules/DummyAlt/File.tsx",
        ]),
      ).toEqual({
        "pages/DummyPath": "dummyPath/src/pages/DummyPath",
        "pages/DummyPath-2": "dummyPath/src/pages/DummyPath-2",
        "pages/DummyPath/_id/HelloWorld":
          "dummyPath/src/pages/DummyPath/$id/HelloWorld",
        "modules/DummyModule1": "dummyPath/src/modules/DummyModule1",
        "modules/DummyModule2": "dummyPath/src/modules/DummyModule2.ts",
        "modules/DummyModule3": "dummyPath/src/modules/DummyModule3.tsx",
        "modules/DummyModule4": "dummyPath/src/modules/DummyModule4.js",
        "modules/DummyModule5": "dummyPath/src/modules/DummyModule5.jsx",
        "altSrc/customModules/DummyAltSource":
          "dummyPath/altSrc/customModules/DummyAltSource",
        "altSrc/customModules/DummyAlt/File":
          "dummyPath/altSrc/customModules/DummyAlt/File.tsx",
      });
    });
  });

  describe("getBasePath", () => {
    it("config url is defined", () => {
      expect(getBasePath("/baseUrl")).toBe("/baseUrl");
    });
    it("config url and vite base are defined", () => {
      expect(getBasePath("/baseUrl", "/viteBase/")).toBe("/viteBase/");
    });
    it("config url is undefined, vite base is defined", () => {
      expect(getBasePath(undefined, "/viteBase")).toBe("/viteBase");
    });
    it("config url and vite base are undefined", () => {
      expect(getBasePath()).toBe("/");
    });
  });
});
