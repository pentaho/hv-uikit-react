import { HvLoading, HvSection, HvTypography } from "@pentaho/uikit-react-core";

interface ChartContainerProps {
  children: React.ReactNode;
  loading: boolean;
  title?: string;
}

export const ChartContainer = ({
  title,
  loading,
  children,
}: ChartContainerProps) => (
  <HvSection
    title={!loading && <HvTypography variant="title4">{title}</HvTypography>}
    className={loading ? "flex items-center justify-center h-full" : undefined}
    classes={{
      content: "h-full",
    }}
  >
    {loading ? <HvLoading small /> : children}
  </HvSection>
);
