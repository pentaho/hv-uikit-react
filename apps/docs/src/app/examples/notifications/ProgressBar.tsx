import { useState } from "react";
import { css } from "@emotion/css";
import { HvButton, HvSnackbar } from "@hitachivantara/uikit-react-core";
import { theme } from "@hitachivantara/uikit-styles";

const styles = {
  snackbar: css({
    "& .HvSnackbarContent-root": {
      overflow: "hidden",
      "&::after": {
        position: "absolute",
        height: 4,
        top: 0,
        left: 0,
        width: "100%",
        content: '""',
        backgroundColor: theme.colors.positiveSubtle,
      },
      "&::before": {
        position: "absolute",
        height: 4,
        top: 0,
        left: 0,
        content: '""',
        backgroundColor: "var(--icolor)",
        animation: "progressAnimation 3000ms linear forwards",
        animationDuration: "var(--duration)",
        transformOrigin: "left",
        zIndex: 1,
      },
    },
    "@keyframes progressAnimation": {
      from: {
        width: "0%",
      },
      to: {
        width: "100%",
      },
    },
  }),
};

export default function Demo() {
  const [open, setOpen] = useState(false);

  // Customize duration to change the speed of the progress bar.
  const duration = 1000;

  return (
    <div className="flex justify-center w-full">
      <HvButton onClick={() => setOpen(true)}>Show Snackbar</HvButton>
      <HvSnackbar
        className={styles.snackbar}
        open={open}
        title="Snackbar title"
        label="Snackbar with a progress bar."
        variant="success"
        transitionDirection="up"
        showIcon
        autoHideDuration={duration}
        style={
          {
            "--duration": `${duration}ms`,
          } as React.CSSProperties & Record<string, any>
        }
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
