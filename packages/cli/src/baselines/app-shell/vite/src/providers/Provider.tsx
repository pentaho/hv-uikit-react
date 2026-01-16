import { Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { useI18nInstance } from "../lib/i18n";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const i18n = useI18nInstance();

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export function withProvider<
  P extends Record<string, unknown> = Record<string, unknown>,
>(WrappedComponent: React.ComponentType<P>) {
  const ComponentWithProvider: React.FC<P> = (props) => {
    return (
      <Suspense fallback={null}>
        <WrappedComponent {...props} />
      </Suspense>
    );
  };

  const displayName = WrappedComponent.displayName || WrappedComponent.name;
  ComponentWithProvider.displayName = `withProvider(${displayName})`;

  return ComponentWithProvider;
}

export default Provider;
