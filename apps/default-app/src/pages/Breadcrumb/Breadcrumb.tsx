/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "i18next";
import { useHvCurrentNavigationPath } from "@hitachivantara/app-shell-navigation";
import {
  HvBreadCrumb,
  HvGlobalActions,
  HvTextArea,
} from "@hitachivantara/uikit-react-core";

import { initAppI18n } from "../../utils/i18n";

initAppI18n();

export interface GlobalProviderProps {
  children?: React.ReactNode;
}

const withProvider = <T extends GlobalProviderProps = GlobalProviderProps>(
  WrappedComponent: React.ComponentType<T>,
) => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithProvider = (props: Omit<T, keyof GlobalProviderProps>) => {
    return (
      <I18nextProvider i18n={i18next}>
        <WrappedComponent {...(props as T)} />
      </I18nextProvider>
    );
  };

  ComponentWithProvider.displayName = `withProvider(${displayName})`;

  return ComponentWithProvider;
};

const Breadcrumb = () => {
  const paths = useHvCurrentNavigationPath();
  const { t } = useTranslation();

  const listRoute = paths.map((path) => {
    return {
      ariaLabel: path.label,
      label: path.label,
      path: path.path || "dummyPath",
      to: path.path,
    };
  });

  return (
    <div className="grid gap-sm">
      <HvGlobalActions title={t("breadcrumbTitle" as any)} backButton={false} />
      <HvBreadCrumb
        aria-label="Breadcrumb"
        id="breadcrumb6"
        listRoute={listRoute}
        onClick={(event, itemData) =>
          console.info(
            `Clicked on breadcrumb item with label:[${itemData.label}] and path:[${itemData.path}]`,
          )
        }
      />
      <HvTextArea
        rows={10}
        label="Value"
        value={JSON.stringify(paths, null, " ")}
      />
    </div>
  );
};

export default withProvider(Breadcrumb);
