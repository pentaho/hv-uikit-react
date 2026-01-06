import { AsyncResult } from "./async";
import { ServiceId } from "./config";

/**
 * Reference to a service, including metadata and a loader function.
 * Can be used to access service details and also resolve its service instance.
 */
export type ServiceReference<TService = unknown> = {
  serviceId: ServiceId;

  ranking: number;

  getService(): Promise<TService>;
};

/**
 * Loader function type for asynchronously loading of a service that returns a promise resolving to the service instance.
 */
export type ServiceLoader<TService> = () => Promise<TService>;

/**
 * Base options for service operations.
 * Used as a foundation for more specific service option types.
 */
export type GetServiceBaseOptions = {};

/**
 * Options when getting a single service.
 */
export type GetServiceOptions = GetServiceBaseOptions; // NOSONAR

/**
 * Error handling strategies that determine how errors are managed when loading services:
 * - "reject-on-any-failure": Rejects if any service resolution fails (use for critical services);
 * - "reject-on-all-failures" (default): Only rejects if all service resolutions fail (optimistic approach);
 * - "ignore-failures": Never rejects, returns only successfully resolved services.
 */
export type ServicesErrorHandling =
  | "reject-on-any-failure"
  | "reject-on-all-failures"
  | "ignore-failures";

/**
 * Options when getting multiple services, with error handling configuration.
 */
export type GetServicesOptions = GetServiceBaseOptions & {
  errorHandling?: ServicesErrorHandling;
};

/**
 * Options when getting a service reference.
 */
export type GetServiceReferenceOptions = GetServiceBaseOptions; // NOSONAR

/**
 * Options when getting multiple service references.
 */
export type GetServiceReferencesOptions = GetServiceBaseOptions; // NOSONAR

export type ServiceManager = {
  /**
   * Accepts a service ID and optional options. Returns a promise resolving to the highest-ranked service instance, or rejects if resolution fails.
   */
  getService<TService>(
    serviceId: ServiceId,
    options?: GetServiceOptions,
  ): Promise<TService>;

  /**
   * Accepts a service ID and optional options. Returns a promise resolving to all successfully resolved service instances, following the error handling strategy.
   */
  getServices<TService>(
    serviceId: ServiceId,
    options?: GetServicesOptions,
  ): Promise<TService[]>;

  /**
   * Accepts a service ID and optional options. Returns a reference to the highest-ranked service.
   */
  getServiceReference<TService>(
    serviceId: ServiceId,
    options?: GetServiceReferenceOptions,
  ): ServiceReference<TService>;

  /**
   * Accepts a service ID and optional options. Returns all service references for the ID, sorted by descending ranking.
   */
  getServiceReferences<TService>(
    serviceId: ServiceId,
    options?: GetServiceReferencesOptions,
  ): ServiceReference<TService>[];
};

/**
 * Options to control service resolution
 */
export type UseServiceOptions = GetServiceOptions; // NOSONAR

/**
 * Options to control services resolution, like error handling strategy.
 */
export type UseServicesOptions = GetServicesOptions; // NOSONAR

/**
 * Options to control the service reference to return.
 */
export type UseServiceReferenceOptions = GetServiceReferenceOptions; // NOSONAR

/**
 * Options to control the service references to return.
 */
export type UseServiceReferencesOptions = GetServiceReferencesOptions; // NOSONAR

/**
 * Result type for the {@link useService} hook that represents the async state of a single service fetch operation.
 */
export type UseServiceResult<TService> = AsyncResult<
  TService,
  Error,
  "service"
>;

/**
 * Result type for the {@link useServices} hook that represents the async state of fetching multiple services.
 */
export type UseServicesResult<TService> = AsyncResult<
  TService[],
  Error,
  "services",
  TService[]
>;
