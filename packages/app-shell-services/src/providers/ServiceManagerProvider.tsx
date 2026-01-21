import {
  createContext,
  createElement,
  FC,
  PropsWithChildren,
  useMemo,
} from "react";

import { ServiceId, ServicesConfig } from "../types/config";
import {
  GetServiceBaseOptions,
  GetServiceOptions,
  GetServiceReferenceOptions,
  GetServiceReferencesOptions,
  GetServicesOptions,
  ServiceManager,
  ServiceReference,
} from "../types/service";
import { createServiceReference } from "../utils/serviceReference";

function createServiceReferenceMap(services: ServicesConfig = {}) {
  return Object.entries(services).reduce<Map<ServiceId, ServiceReference[]>>(
    (map, [serviceId, serviceProviderConfigs]) => {
      const serviceReferences = serviceProviderConfigs
        .map((serviceProviderConfig) =>
          createServiceReference(serviceId, serviceProviderConfig),
        )
        .toSorted((a, b) => b.ranking - a.ranking);

      map.set(serviceId, serviceReferences);
      return map;
    },
    new Map<ServiceId, ServiceReference[]>(),
  );
}

function createServiceManager(services: ServicesConfig = {}): ServiceManager {
  const serviceReferenceMap = createServiceReferenceMap(services);

  function queryServiceReferences<TService>(
    serviceId: ServiceId,
    _options?: GetServiceBaseOptions,
  ) {
    return (serviceReferenceMap.get(serviceId) ??
      []) as ServiceReference<TService>[];
  }

  function queryServiceReference<TService>(
    serviceId: string,
    options?: GetServiceBaseOptions,
  ) {
    const references = queryServiceReferences<TService>(serviceId, options);

    if (references.length === 0) {
      throw new Error(`Service ${serviceId} has no service providers.`);
    }

    return references[0];
  }

  return {
    getServiceReference<TService>(
      serviceId: string,
      options?: GetServiceReferenceOptions,
    ): ServiceReference<TService> {
      return queryServiceReference<TService>(serviceId, options);
    },

    getServiceReferences<TService>(
      serviceId: string,
      options?: GetServiceReferencesOptions,
    ): ServiceReference<TService>[] {
      return queryServiceReferences<TService>(serviceId, options);
    },

    async getService<TService>(
      serviceId: string,
      options?: GetServiceOptions,
    ): Promise<TService> {
      const reference = queryServiceReference<TService>(serviceId, options);
      return reference.getService();
    },

    async getServices<TService>(
      serviceId: string,
      options?: GetServicesOptions,
    ): Promise<TService[]> {
      const references = queryServiceReferences<TService>(serviceId, options);

      if (references.length === 0) {
        return [] as TService[];
      }

      const errorHandling = options?.errorHandling ?? "reject-on-all-failures";

      const results = await Promise.allSettled(
        references.map((reference) => reference.getService()),
      );

      const successful: TService[] = [];
      const errors: Error[] = [];

      for (const result of results) {
        if (result.status === "fulfilled") {
          successful.push(result.value);
        } else {
          errors.push(
            result.reason instanceof Error
              ? result.reason
              : new Error(String(result.reason)),
          );
        }
      }

      switch (errorHandling) {
        case "reject-on-any-failure":
          if (errors.length > 0) {
            throw errors[0];
          }
          break;

        case "reject-on-all-failures":
          if (errors.length === results.length) {
            throw new Error(
              `All service providers failed for service '${serviceId}'. First error: ${errors[0].message}`,
            );
          }
          break;

        case "ignore-failures":
          break;
      }

      return successful;
    },
  };
}

export const ServicesContext = createContext<ServiceManager | undefined>(
  undefined,
);

type ServiceManagerConfig = {
  services?: ServicesConfig;
};

interface Props extends PropsWithChildren {
  config: ServiceManagerConfig;
}

const ServiceManagerProvider: FC<Props> = ({ config, children }) => {
  const serviceManager = useMemo(() => {
    return createServiceManager(config.services);
  }, [config.services]);

  return createElement(
    ServicesContext.Provider,
    { value: serviceManager },
    children,
  );
};

export default ServiceManagerProvider;
