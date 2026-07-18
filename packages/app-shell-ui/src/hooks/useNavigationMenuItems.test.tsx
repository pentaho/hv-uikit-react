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
import { act, renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import TestProvider from "../tests/TestProvider";
import useNavigationMenuItems from "./useNavigationMenuItems";

const navigateMock = vi.fn();
vi.mock("@hitachivantara/app-shell-navigation", async () => {
  const mod = await vi.importActual("@hitachivantara/app-shell-navigation");
  return {
    ...(mod as object),
    useHvNavigation: vi.fn(() => {
      return {
        navigate: navigateMock,
      };
    }),
  };
});

const useLocationMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const mod = await vi.importActual("react-router-dom");
  return {
    ...(mod as object),
    useLocation: () => useLocationMock(),
  };
});

useLocationMock.mockReturnValue({
  pathname: "/dummyTarget1",
  state: {},
  search: "",
  hash: "",
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <TestProvider
    config={{
      menu: [
        {
          label: "dummyMenu1",
          target: "/dummyTarget1",
        },
        {
          label: "dummyMenu2",
          target: "/dummyTarget2",
        },
      ],
    }}
  >
    {children}
  </TestProvider>
);

describe("useNavigationMenuItem Hook", () => {
  describe("With no selectedItemId in state and pathname set to base path `/`", () => {
    beforeEach(() => {
      useLocationMock.mockReturnValue({
        pathname: "/",
        state: {},
        search: "",
        hash: "",
      });
    });

    it("should call 'navigateTo' method with the first menu item id and path", async () => {
      await act(async () => renderHook(useNavigationMenuItems, { wrapper }));

      await waitFor(() => {
        expect(navigateMock).toHaveBeenCalledWith("./dummyTarget1");
      });
    });
  });
});
