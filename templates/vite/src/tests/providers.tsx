import { Suspense } from "react";
import { HvProvider } from "@pentaho/uikit-react-core";

import { SUSPENSE_LABEL } from "./mocks";

/** Base Test Provider */
export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={SUSPENSE_LABEL}>
      <HvProvider>{children}</HvProvider>
    </Suspense>
  );
};
