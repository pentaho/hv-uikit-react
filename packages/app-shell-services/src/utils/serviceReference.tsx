import { createElement, FC, PropsWithChildren } from "react";

import {
  BundleConfig,
  ComponentServiceProviderConfig,
  FactoryServiceFunction,
  FactoryServiceProviderConfig,
  InstanceServiceProviderConfig,
  ServiceConfigBase,
  ServiceId,
  ServiceProviderConfig,
} from "../types/config";
import { ServiceLoader, ServiceReference } from "../types/service";

function createServiceReferenceBase<TService>(
  serviceId: ServiceId,
  serviceConfig: ServiceConfigBase,
  getService: ServiceLoader<TService>,
): ServiceReference<TService> {
  return {
    serviceId,
    ranking: serviceConfig.ranking ?? 0,
    getService,
  };
}

// Helper function to validate imported ESM modules and extract the default export.
function validateImportedModule<TService>(
  imported: unknown,
  serviceId: ServiceId,
  bundlePath: string,
): TService {
  if (!imported) {
    throw new Error(
      `Bundle import failed for ${bundlePath} and service ${serviceId}`,
    );
  }

  if (
    typeof imported === "object" &&
    "default" in imported &&
    (imported as { default: unknown }).default != null
  ) {
    return (imported as { default: unknown }).default as TService;
  }

  // Enforce policy: no CommonJS or direct function root exports allowed.
  throw new Error(
    `ESM default export missing for ${bundlePath} (service ${serviceId}). Ensure the module uses a default export.`,
  );
}

/**
 * Generic helper to pick between a direct value and a bundle definition, enforcing that
 * value takes precedence when both are (incorrectly) present.
 */
function selectValueOrBundle(
  provider: any,
  serviceId: ServiceId,
  kind: "instance" | "factory" | "component",
):
  | { mode: "value"; value: unknown }
  | { mode: "bundle"; bundle: string; config?: BundleConfig } {
  const hasValue = "value" in provider && provider.value !== undefined;
  const hasBundle = "bundle" in provider && typeof provider.bundle === "string";

  if (hasValue) {
    if (hasBundle) {
      console.warn(
        `${kind} service config for ${serviceId} contains both 'value' and 'bundle'. 'value' takes precedence and 'bundle' will be ignored.`,
      );
    }
    return { mode: "value", value: provider.value };
  }

  if (hasBundle) {
    return { mode: "bundle", bundle: provider.bundle, config: provider.config };
  }

  throw new Error(`Invalid ${kind} service config for ${serviceId}`);
}

function createInstanceReference<TService>(
  serviceId: ServiceId,
  config: InstanceServiceProviderConfig,
): ServiceReference<TService> {
  const selection = selectValueOrBundle(
    config.instance as any,
    serviceId,
    "instance",
  );

  const serviceLoader: ServiceLoader<TService> = async () => {
    if (selection.mode === "value") {
      return selection.value as TService;
    }

    const imported = await import(/* @vite-ignore */ selection.bundle);
    return validateImportedModule<TService>(
      imported,
      serviceId,
      selection.bundle,
    );
  };

  return createServiceReferenceBase<TService>(serviceId, config, serviceLoader);
}

function createFactoryReference<TService>(
  serviceId: ServiceId,
  config: FactoryServiceProviderConfig,
): ServiceReference<TService> {
  let loaded = false;
  let serviceInstance: TService | undefined;

  const selection = selectValueOrBundle(
    config.factory as any,
    serviceId,
    "factory",
  );

  const serviceLoader: ServiceLoader<TService> = async () => {
    if (!loaded) {
      let factoryExport: unknown;
      let providedConfig: BundleConfig | undefined;

      if (selection.mode === "value") {
        factoryExport = selection.value;
      } else {
        const imported = await import(/* @vite-ignore */ selection.bundle);
        factoryExport = validateImportedModule<unknown>(
          imported,
          serviceId,
          selection.bundle,
        );
        providedConfig = selection.config;
      }

      if (typeof factoryExport !== "function") {
        throw new Error(
          `Factory service for ${serviceId} did not resolve to a function. Value: ${factoryExport}`,
        );
      }

      const factoryFn = factoryExport as FactoryServiceFunction<TService>;
      serviceInstance = factoryFn(providedConfig);
      loaded = true;
    }

    return serviceInstance!;
  };

  return createServiceReferenceBase<TService>(serviceId, config, serviceLoader);
}

function createComponentReference<TService extends FC>(
  serviceId: ServiceId,
  config: ComponentServiceProviderConfig,
): ServiceReference<TService> {
  let loaded = false;
  let serviceInstance: TService | undefined;

  const selection = selectValueOrBundle(
    config.component as any,
    serviceId,
    "component",
  );

  const serviceLoader: ServiceLoader<TService> = async () => {
    if (!loaded) {
      let componentExport: unknown;
      let providedConfig: BundleConfig | undefined;

      if (selection.mode === "value") {
        componentExport = selection.value;
      } else {
        const imported = await import(/* @vite-ignore */ selection.bundle);
        componentExport = validateImportedModule<unknown>(
          imported,
          serviceId,
          selection.bundle,
        );
        providedConfig = selection.config;
      }

      if (typeof componentExport !== "function") {
        throw new Error(
          `Component definition for service ${serviceId} is not a React component function`,
        );
      }

      serviceInstance = bindComponent(
        componentExport as TService,
        providedConfig ?? {},
      );
      loaded = true;
    }

    return serviceInstance!;
  };

  return createServiceReferenceBase<TService>(serviceId, config, serviceLoader);
}

/**
 * Create a ServiceReference for the given service identifier and provided configuration.
 * A service can be provided in one of three shapes:
 * - instance: Provides a service instance either directly (using `value`) or by lazy-loading a module (using `bundle`).
 *   The instance is used as-is and no further construction occurs.
 * - factory: Provides a factory function either directly (using `value`) or by lazy-loading a module (using `bundle`).
 *   The factory function is called with a config object if provided to produce the service instance. The value must always be a function.
 * - component: Provides a React component either directly (using `value`) or by lazy-loading a module (using `bundle`).
 *   The component is used as-is or bound with a config object if provided. The value must always be a React component function.
 *
 * This function abstracts the details of how services are provided, allowing consumers to reference services uniformly regardless of whether they are direct values or loaded from bundles.
 *
 * @template TService The concrete service type returned by the created reference.
 * @param serviceId Identifier for the service being referenced.
 * @param serviceProviderConfig Configuration that determines how the service is provided.
 * @returns A {@link ServiceReference} object exposing metadata and a getService() loader that resolves the service.
 * @throws {Error} If the provided configuration shape is unsupported, or if a factory service does not resolve to a function. Errors from dynamic imports, missing exports, or invalid factory/component shapes are propagated by the underlying provider implementations.
 */
export function createServiceReference<TService = unknown>(
  serviceId: ServiceId,
  serviceProviderConfig: ServiceProviderConfig,
): ServiceReference<TService> {
  if ("instance" in serviceProviderConfig) {
    return createInstanceReference<TService>(serviceId, serviceProviderConfig);
  }

  if ("factory" in serviceProviderConfig) {
    return createFactoryReference<TService>(serviceId, serviceProviderConfig);
  }

  if ("component" in serviceProviderConfig) {
    return createComponentReference<TService extends FC ? TService : FC>(
      serviceId,
      serviceProviderConfig,
    ) as ServiceReference<TService>;
  }

  throw new Error(
    `Unsupported service provider configuration for service ${serviceId}`,
  );
}

function bindComponent<
  TComponent extends FC<PropsWithChildren<P>>,
  P extends BundleConfig,
>(Component: TComponent, configProps: P): TComponent {
  const BoundComponent = (props: PropsWithChildren<P>) => {
    // Explicitly passed props override the ones from coming from the config
    const mergedProps = { ...configProps, ...props };
    return createElement(Component, mergedProps);
  };

  return BoundComponent as TComponent;
}
