# @hitachivantara/app-shell-services

App Shell Services. Support package to manage services at the App Shell ecosystem.

## Overview

This package provides service management capabilities including:

- Service registration and resolution
- React hooks for service consumption
- Type-safe service interfaces

## Usage

Services supports a consumer/provider model where:

- Consumers, like an app owning a header action for example, will consume a given service _contract_ either from the shared-services package from other app or, if also a provider, its own shared-services package. The services are identified by an `id` that, ideally, should be unique while also providing information about the type it expects like `main-app:AppsMetadata`. This way, the consumers know the type they expect and the providers know what to implement, without collisions in the multi-tenant App Shell ecosystem.
- Providers implement services that match the consumer's contract and register them under the consumer's `id` in its `app-shell.config.ts` file as example below:

```typescript
services: {
  "@some-package/main-app-services:AppsMetadata": [{
    instance: {
       value: {
         name: "dummy app",
         description: "This is 'dummy app' description",
         version: 2.0,
         final: false,
       }
    }
  }],
}
```

This way, looking at the configuration, it is clear that there is a consumer application (main-app) that expects service-providers to implement the `AppsMetadata` contract and register them under its `@some-package/main-app-services:AppsMetadata` service definition, keeping the consumer resilient: as long as service-providers adhere to the declared contract the consumer code will not break.

## Example (consumer)

Exploring the example above, the consumer should register the service contract and definition in a package that can be shared between the consumer and the provider:

```typescript
// @some-package/main-app-services
export type AppsMetadata = {
  appId: string;
  appName: string;
  version: number;
  isRelease: boolean;
};

/**
 * Service definitions that the consumer 'main app' exposes on a services shared package.
 */
export const MainAppServiceDefinitions = {
  /**
   * The {@const AppsMetadata} service represents the service-provider application metadata.
   *
   * The service-providers that implement this contract will have its implementation displayed on a page.
   *
   * Instances of this service are typescript constants of type {@link AppsMetadata}.
   */
  AppsMetadata: {
    id: "@some-package/main-app-services:AppsMetadata",
  },
};
```

The main app consumes all the service definitions under its identifier using the `useServices` hook, which returns all the successfully loaded services of the requested identifier, namely the `MainAppServiceDefinitions.AppsMetadata` service definition.
This way, as long as any provider implements and registers a service that matches the `AppsMetadata` contract, it will be safe to render as expected:

```typescript
const AboutApps: FC = () => {
  const { services: appsMetadata[], isPending, error } = useServices<AppsMetadata[]>(
    ServiceDefinitions.AppsMetadata.id,
  );

  if (isPending) {
    return <HvLoading>Loading apps metadata from services...</HvLoading>;
  }

  if (error) {
    const errorMessage = `Failed to apps metadata: ${ServiceDefinitions.AppsMetadata.id}`;
    return <HvTypography>{errorMessage}</HvTypography>;
  }

  return (
    <HvContainer maxWidth="lg">
      <HvTypography variant="title1">Applications information</HvTypography>
      <HvGrid container spacing={3}>
        {appsMetadata.map((metadata, index) => {
          return (
            <HvGrid item key={metadata.appId}>
              <HvTypography>
                <strong>Application: </strong> {metadata.appName}
              </HvTypography>
              <HvTypography>
                {metadata.version} - {metadata.isRelease ? "Release" : "In development"}
              </HvTypography>
            </HvGrid>
          );
        })}
      </HvGrid>
    </HvContainer>
  );
};
```

## Example (provider)

A simple way to implement a service-provider that matches the `AppsMetadata` contract is a constant like below:

```typescript
import { AppsMetadata } from "@some-package/main-app-services";

const dummyAppMetadata: AppsMetadata = {
  appId: "ProviderApp",
  appName: "A provider app",
  version: 1.0,
  isRelease: true,
};
```

and having it registered on its `app-shell.config.ts` file, under the consumer service identifier.

```typescript
  //...
  services: {
    "@some-package/main-app-services:AppsMetadata": [
      {
        instance: {
          bundle: "dummy-app/metadata/dummyAppMetadata.js",
        },
        ranking: 100,
      }
    ],
  },
  //...
```

### More examples

To see more examples, please check the [Default App](../../apps/default-app) `ServicesDemo` page and the `app-shell.config.ts` file.

## Installation

The App Shell Services is available as an NPM package, and can be installed with:

```bash
npm install @hitachivantara/app-shell-services
```
