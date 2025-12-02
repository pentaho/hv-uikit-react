export interface ServicesConfig
  extends Record<ServiceId, ServiceProviderConfig[]> {}

export type ServiceId = string; //NOSONAR

/**
 * A service configuration can be one of several kinds (instance, factory, component),
 * each of which supports two declaration modes:
 *  - Value: directly provide the instance, factory or component
 *  - Bundle: module to be lazy loaded with optional config object
 */
export type ServiceProviderConfig =
  | InstanceServiceProviderConfig
  | FactoryServiceProviderConfig
  | ComponentServiceProviderConfig;

export interface ServiceConfigBase {
  ranking?: number;
}

/** Directly provided value */
export interface Value {
  value: unknown;
}

/** Bundle for lazy loading */
export interface Bundle {
  bundle: string;
}

export interface BundleConfig extends Record<string, unknown> {}

export interface InstanceServiceProviderConfig extends ServiceConfigBase {
  instance: InstanceValueOrBundle;
}

export interface FactoryServiceProviderConfig extends ServiceConfigBase {
  factory: FactoryValueOrBundle;
}

export interface ComponentServiceProviderConfig extends ServiceConfigBase {
  component: ComponentValueOrBundle;
}

export type InstanceValueOrBundle = Value | Bundle;

// Factory function type used when a factory bundle exports a creator
export type FactoryServiceFunction<
  TService = unknown,
  TConfig = BundleConfig,
> = (config?: TConfig) => TService;

// What a factory direct value or lazy loaded bundle may provide: always a factory function
export type FactoryExport<
  TService = unknown,
  TConfig = BundleConfig,
> = FactoryServiceFunction<TService, TConfig>;

// Factory value or bundle: value must be a function
export type FactoryValueOrBundle<TBundleConfig = BundleConfig> =
  | { value: FactoryServiceFunction }
  | (Bundle & { config?: TBundleConfig });

export type ComponentValueOrBundle<TBundleConfig = BundleConfig> =
  | Value
  | (Bundle & { config?: TBundleConfig });
