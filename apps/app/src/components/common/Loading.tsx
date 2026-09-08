import { HvEmptyState, HvLoading } from "@pentaho/uikit-react-core";
import { Info } from "@pentaho/uikit-react-icons";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  hasError?: boolean;
  isLoading?: boolean;
  loadingLabel?: string;
  errorTitle?: string | React.ReactNode;
  errorMessage?: string | React.ReactNode;
  errorAction?: string | React.ReactNode;
}

export const Loading = ({
  isLoading = false,
  hasError = false,
  loadingLabel = "Loading Page",
  errorTitle = "Unable to load page",
  errorMessage = "If this problem persists, please contact administrator.",
  errorAction = "Here has link to reload page.",
}: LoadingProps) => {
  return (
    <>
      {hasError && (
        <HvEmptyState
          className="items-center"
          title={errorTitle}
          message={errorMessage}
          action={errorAction}
          icon={<Info color="negative" />}
        />
      )}
      {!hasError && isLoading && (
        <HvLoading className="h-full z-overlay" label={loadingLabel} />
      )}
    </>
  );
};
