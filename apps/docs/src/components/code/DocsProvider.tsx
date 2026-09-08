import { useId } from "react";
import { useTheme } from "nextra-theme-docs";
import { HvProvider, themes } from "@pentaho/uikit-react-core";

export const DocsProvider = ({
  children,
  className,
}: React.HTMLAttributes<HTMLDivElement>) => {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const theme = themes.pentaho;

  return (
    // ensures docs container styles change according to theme
    <div id={id} className={className} data-pagefind-ignore>
      <HvProvider
        theme={theme}
        colorMode={resolvedTheme === "dark" ? "dark" : "light"}
        cssTheme="scoped"
        rootElementId={id}
      >
        {children}
      </HvProvider>
    </div>
  );
};

export const DocsContainer = ({
  element,
  error,
  className,
}: {
  /** render-able element provided by `react-live` */
  element: React.ReactElement | null;
  /** error message provided by `react-live */
  error?: string | null;
  /** container styles `className` */
  className?: string;
}) => {
  return (
    <DocsProvider className={className}>
      {error ? (
        // render errors or the live preview
        <div className="text-negative">{error}</div>
      ) : (
        // an unstyled `div` must wrap `element` to ensure predictable layout
        <div className="sample-container">{element}</div>
      )}
    </DocsProvider>
  );
};
