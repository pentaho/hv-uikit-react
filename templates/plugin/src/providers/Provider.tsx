// Wraps every view of the plugin (app-shell.config.ts, providers). Add the plugin's shared context here.
import type { ReactNode } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
