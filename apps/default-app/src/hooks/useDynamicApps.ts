import { useEffect, useState } from "react";
import type {
  HvAppShellAppSwitcherItemConfig,
  UseDynamicAppsResult,
} from "@hitachivantara/app-shell-shared";

/**
 * Example hook that provides apps dynamically at runtime.
 * Simulates fetching apps from a backend service with a short delay.
 */
const useDynamicApps = (): UseDynamicAppsResult => {
  const [isPending, setIsPending] = useState(true);
  const [result, setResult] = useState<HvAppShellAppSwitcherItemConfig[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResult([
        {
          label: "Dynamic App",
          description: "Loaded at runtime",
          url: "https://lumada-design.github.io/app-shell/latest/",
          target: "NEW",
          icon: { iconType: "uikit", name: "Cloud" },
        },
      ]);
      setIsPending(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (isPending) {
    return { isPending: true, error: null, result: undefined };
  }

  return { isPending: false, error: null, result };
};

export default useDynamicApps;
