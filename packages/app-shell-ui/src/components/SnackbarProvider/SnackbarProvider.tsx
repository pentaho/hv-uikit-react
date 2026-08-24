import { HvSnackbarProvider } from "@pentaho/uikit-react-core";

interface SnackbarProviderProps {
  children: React.ReactNode;
}

const SnackbarProvider = ({ children }: SnackbarProviderProps) => {
  return (
    <HvSnackbarProvider
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {children}
    </HvSnackbarProvider>
  );
};

export default SnackbarProvider;
