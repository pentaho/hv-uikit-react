import { useMemo } from "react";
import { HvAppShellProvidersComponent } from "@hitachivantara/app-shell-shared";

interface CombinedProvidersProps extends React.PropsWithChildren {
  providers?: HvAppShellProvidersComponent[];
}

const CombinedProviders = ({
  children: mainChildren,
  providers,
}: CombinedProvidersProps) => {
  const combined = useMemo(() => {
    if (!providers || providers.length === 0) {
      return mainChildren;
    }

    return providers.reduceRight(
      (Acc, { component: Curr, config, key }) => (
        <Curr key={key} {...config}>
          {Acc}
        </Curr>
      ),
      mainChildren,
    );
  }, [providers, mainChildren]);

  return <>{combined}</>;
};

export default CombinedProviders;
