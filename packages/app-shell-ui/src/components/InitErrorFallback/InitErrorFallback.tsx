import { HvTypography } from "@hitachivantara/uikit-react-core";

/**
 * Minimal error fallback rendered by the outermost Error Boundary in the App
 * Shell. Catches errors that occur during the initialization phase — primarily
 * config-fetch failures — before providers like `I18nextProvider` are mounted.
 *
 * Must NOT use `useTranslation` or any provider-dependent hook since it renders
 * precisely when those providers are unavailable.
 */
const InitErrorFallback = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
      textAlign: "center",
      padding: 24,
    }}
  >
    <HvTypography variant="title2">Initialization Error</HvTypography>
    <HvTypography style={{ marginTop: 8 }}>
      Something went wrong during initialization. Please try again later.
    </HvTypography>
  </div>
);

export default InitErrorFallback;
