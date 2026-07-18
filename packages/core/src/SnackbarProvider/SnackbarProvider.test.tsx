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
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SnackbarProviderButtons as SnackbarProvider } from "./stories/SnackbarProviderButtons";

const assertSnackbar = async (buttonName: string, snackbarText: string) => {
  const snackbarSpawner = screen.getByRole("button", { name: buttonName });

  expect(screen.queryByText(snackbarText)).not.toBeInTheDocument();

  fireEvent.click(snackbarSpawner);
  expect(await screen.findByText(snackbarText)).toBeInTheDocument();

  fireEvent.click(snackbarSpawner);
  fireEvent.click(snackbarSpawner);
  fireEvent.click(snackbarSpawner);
  fireEvent.click(snackbarSpawner);
  const snackbars = await screen.findAllByText(snackbarText);
  expect(snackbars.length).toBe(5);
};

describe("HvSnackbarProvider", () => {
  describe("interactions", () => {
    it("renders the action snackbar", async () => {
      render(<SnackbarProvider />);

      await assertSnackbar("Action", "This is an action snackbar");
    });

    it("renders the success snackbar", async () => {
      render(<SnackbarProvider />);

      await assertSnackbar("Success", "This is a success snackbar");
    });
    it("renders the warning snackbar", async () => {
      render(<SnackbarProvider />);

      await assertSnackbar("Warning", "This is a warning snackbar");
    });
    it("renders the error snackbar", async () => {
      render(<SnackbarProvider />);

      await assertSnackbar("Error", "This is an error snackbar");
    });
  });
});
