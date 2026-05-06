import { useCallback, useRef } from "react";

import type { ServiceId } from "../types/config";
import type {
  ServiceReference,
  UseServiceOptions,
  UseServiceReferenceOptions,
  UseServiceReferencesOptions,
  UseServiceResult,
  UseServicesOptions,
  UseServicesResult,
} from "../types/service";
import { isEqual } from "../utils/isEqual";
import { useAsync } from "./useAsync";
import { useServicesContext } from "./useServicesContext";

/**
 * Services entrypoint in the form of hooks for consuming service instances and service references.
 *
 * See the {@link ServiceManager} and related types for full, authoritative details.
 */

/**
 * Custom hook for deep comparison memoization using lodash.isEqual.
 * This stabilizes object references based on deep equality rather than reference equality.
 */
function useDeepMemo<T>(value: T): T {
  const ref = useRef<T>();

  if (!isEqual(value, ref.current)) {
    ref.current = structuredClone(value);
  }

  return ref.current as T;
}

/**
 * Resolves and returns the service instance for a given service id or reference.
 *
 * Overloads:
 * - useService<TService>(serviceReference: ServiceReference<TService>): UseServiceResult<TService>
 * - useService<TService>(serviceId: ServiceId, options?: UseServiceOptions): UseServiceResult<TService>
 *
 * @param serviceReference - A {@link ServiceReference} object to resolve to a service instance.
 * @param serviceId - The identifier of the service to resolve.
 * @param options - Options to control service resolution.
 * @returns A {@link UseServiceResult} object representing the loading state, error, and resolved service instance.
 *
 * When called with a {@link ServiceReference}, resolves that reference using its getService().
 * When called with a {@link ServiceId}, resolves and returns the highest-ranked service instance for that id.
 * If resolution fails, the error is available in the result.
 */
export function useService<TService>(
  serviceReference: ServiceReference<TService>,
): UseServiceResult<TService>;

export function useService<TService>(
  serviceId: ServiceId,
  options?: UseServiceOptions,
): UseServiceResult<TService>;

/**
 * Implementation of useService.
 */
export function useService<TService>(
  serviceIdOrRef: ServiceId | ServiceReference<TService>,
  options?: UseServiceOptions,
): UseServiceResult<TService> {
  const manager = useServicesContext();

  // Deep comparison to stabilize the options object, preventing unnecessary re-renders
  const opts = useDeepMemo(options || {});

  const promiseFactory = useCallback(
    () =>
      isServiceReference<TService>(serviceIdOrRef)
        ? serviceIdOrRef.getService()
        : manager.getService<TService>(serviceIdOrRef, opts),
    [serviceIdOrRef, manager, opts],
  );

  return useAsync(promiseFactory, { dataProp: "service" });
}

/**
 * Gets all service instances for a given service id.
 *
 * @param serviceId - The identifier of the services to resolve.
 * @param options - Options to control services resolution, like error handling strategy.
 * @returns A {@link UseServicesResult} object representing the loading state, error, and resolved array of service instances.
 */
export function useServices<TService>(
  serviceId: ServiceId,
  options?: UseServicesOptions,
): UseServicesResult<TService> {
  const manager = useServicesContext();

  // Deep comparison to stabilize the options object, preventing unnecessary re-renders
  const opts = useDeepMemo(options || {});

  const promiseFactory = useCallback(
    () => manager.getServices<TService>(serviceId, opts),
    [manager, serviceId, opts],
  );

  return useAsync(promiseFactory, { dataProp: "services", pendingData: [] });
}

/**
 * Gets the highest-ranked service reference for the given id.
 *
 * @param serviceId - The identifier of the service to get a reference for.
 * @param options - Options to control the service reference to return.
 * @returns A {@link ServiceReference} object.
 */
export function useServiceReference<TService>(
  serviceId: ServiceId,
  options: UseServiceReferenceOptions = {},
): ServiceReference<TService> {
  const manager = useServicesContext();
  return manager.getServiceReference<TService>(serviceId, options);
}

/**
 * Gets all service references for the given service id, sorted by descending ranking.
 *
 * @param serviceId - The identifier of the service to get references for.
 * @param options - Options to control the service references to return.
 * @returns An array of {@link ServiceReference} objects.
 */
export function useServiceReferences<TService>(
  serviceId: ServiceId,
  options: UseServiceReferencesOptions = {},
): ServiceReference<TService>[] {
  const manager = useServicesContext();
  return manager.getServiceReferences<TService>(serviceId, options);
}

// Type guard to detect a ServiceReference relying on the presence of getService method.
function isServiceReference<TService>(
  value: unknown,
): value is ServiceReference<TService> {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as ServiceReference<TService>).getService === "function"
  );
}
