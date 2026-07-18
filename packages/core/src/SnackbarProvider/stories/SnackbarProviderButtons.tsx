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
import {
  HvButton,
  HvOverflowTooltip,
  HvSnackbarProvider,
  useHvSnackbar,
} from "@hitachivantara/uikit-react-core";

const SnackbarButtons = () => {
  const { enqueueSnackbar, closeSnackbar } = useHvSnackbar();

  return (
    <div className="grid gap-xs w-150px">
      <HvButton
        variant="secondarySubtle"
        onClick={() => {
          enqueueSnackbar("This is a success snackbar", { variant: "success" });
        }}
      >
        Success
      </HvButton>
      <HvButton
        variant="secondarySubtle"
        onClick={() => {
          enqueueSnackbar("This is a warning snackbar", { variant: "warning" });
        }}
      >
        Warning
      </HvButton>
      <HvButton
        variant="secondarySubtle"
        onClick={() => {
          enqueueSnackbar("This is an error snackbar", { variant: "error" });
        }}
      >
        Error
      </HvButton>
      <HvButton
        variant="secondarySubtle"
        onClick={() => {
          const snackbarId = enqueueSnackbar("This is an action snackbar", {
            variant: "default",
            persist: true,
            snackbarContentProps: {
              action: { id: "action", label: "Dismiss" },
              onAction: (evt, action) => {
                console.log("Clicked action", action);
                closeSnackbar(snackbarId);
              },
            },
          });
        }}
      >
        Action
      </HvButton>
      <HvButton
        variant="secondarySubtle"
        onClick={() => {
          const snackbarLabel = (
            <HvOverflowTooltip
              paragraphOverflow
              data={`This is a very ${"very ".repeat(26)}long snackbar.`}
            />
          );
          enqueueSnackbar(snackbarLabel, { variant: "default" });
        }}
      >
        Overflow
      </HvButton>
    </div>
  );
};

export const SnackbarProviderButtons = () => (
  <HvSnackbarProvider autoHideDuration={5000000}>
    <SnackbarButtons />
  </HvSnackbarProvider>
);
