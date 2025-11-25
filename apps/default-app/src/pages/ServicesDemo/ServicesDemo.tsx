import { FC, useState } from "react";
import { useService, useServices } from "@hitachivantara/app-shell-services";
import {
  HvButton,
  HvCard,
  HvCardContent,
  HvGrid,
  HvLoading,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import { MainContainer } from "../../components/MainContainer";
import { ServiceDefinitions } from "../../services/serviceDefinition";
import {
  MessageService,
  NotificationComponentProps,
  SimpleDataService,
  UseCreateNewContentAction,
} from "../../services/types";

const InstanceServiceDemo: FC = () => {
  const { service, isPending, error } = useService<SimpleDataService>(
    ServiceDefinitions.SimpleDataService.id,
  );

  if (isPending) {
    return <HvLoading>Loading instance service...</HvLoading>;
  }

  if (error) {
    const errorMessage = `Failed to load instance type service: ${ServiceDefinitions.SimpleDataService.id}`;
    return <HvTypography>{errorMessage}</HvTypography>;
  }

  return (
    <HvCard>
      <HvCardContent>
        <HvTypography variant="title3" style={{ marginBottom: "16px" }}>
          Instance Service Demo
        </HvTypography>
        <HvTypography style={{ marginBottom: "16px" }}>
          This demonstrates an instance service with direct object values.
        </HvTypography>
        <HvTypography style={{ marginBottom: "8px" }}>
          <strong>Is in debug mode:</strong> {service.debug ? "Yes" : "No"}
        </HvTypography>
        <HvTypography style={{ marginBottom: "8px" }}>
          <strong>Application name:</strong> {service.appName}
        </HvTypography>
        <HvTypography style={{ marginBottom: "8px" }}>
          <strong>Environment:</strong> {service.environment}
        </HvTypography>
        <HvTypography style={{ marginBottom: "8px" }}>
          <strong>Current version:</strong> {service.version}
        </HvTypography>
      </HvCardContent>
    </HvCard>
  );
};

const FactoryServiceDemo: FC = () => {
  const [formattedMessage, setFormattedMessage] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const { services, isPending, error } = useServices<MessageService>(
    ServiceDefinitions.MessageService.id,
  );

  const messageService = services?.[0];

  const handleFormatMessage = () => {
    if (messageService) {
      const formatted = messageService.formatMessage("This is a test message!");
      setFormattedMessage(formatted);
    }
  };

  const handleGetWelcome = () => {
    if (messageService) {
      const welcome = messageService.getWelcomeMessage();
      setWelcomeMessage(welcome);
    }
  };

  if (isPending) {
    return <HvLoading>Loading factory type services...</HvLoading>;
  }

  if (error) {
    const errorMessage = `Failed to load factory type services: ${ServiceDefinitions.MessageService.id}`;
    return <HvTypography>{errorMessage}</HvTypography>;
  }

  return (
    <HvCard>
      <HvCardContent>
        <HvTypography variant="title3" style={{ marginBottom: "16px" }}>
          Factory Service Demo
        </HvTypography>
        <HvTypography style={{ marginBottom: "16px" }}>
          This demonstrates a factory service that creates configured instances.
        </HvTypography>

        <HvGrid container spacing={2} style={{ marginBottom: "16px" }}>
          <HvGrid item>
            <HvButton onClick={handleFormatMessage}>Format Message</HvButton>
          </HvGrid>
          <HvGrid item>
            <HvButton onClick={handleGetWelcome}>Get Welcome</HvButton>
          </HvGrid>
        </HvGrid>

        {formattedMessage && (
          <HvTypography style={{ marginBottom: "8px" }}>
            <strong>Formatted:</strong> {formattedMessage}
          </HvTypography>
        )}
        {welcomeMessage && (
          <HvTypography>
            <strong>Welcome:</strong> {welcomeMessage}
          </HvTypography>
        )}
      </HvCardContent>
    </HvCard>
  );
};

const InstanceBundleServiceDemoInner: FC<{
  actionHooks: UseCreateNewContentAction[];
}> = ({ actionHooks }) => {
  const actionResults = actionHooks.map((actionHook) => actionHook());

  return (
    <HvCard>
      <HvCardContent>
        <HvTypography variant="title3" style={{ marginBottom: "16px" }}>
          Instance (bundle) Service Demo (React Hooks)
        </HvTypography>
        <HvTypography style={{ marginBottom: "16px" }}>
          This demonstrates instance services through lazy loading of bundles
          that provide React hooks.
          <br />
          Example also available in a header dropdown.
        </HvTypography>

        <HvGrid container spacing={2}>
          {actionResults.map((action, index) => {
            if (!action) return null;

            return (
              <HvGrid item key={action.id || `action-${index}`}>
                <HvButton onClick={action.onAction}>
                  {action.label || `Action ${index + 1}`}
                </HvButton>
              </HvGrid>
            );
          })}
        </HvGrid>
      </HvCardContent>
    </HvCard>
  );
};

const InstanceBundleServiceDemo: FC = () => {
  const {
    services: actionHooks,
    isPending,
    error,
  } = useServices<UseCreateNewContentAction>(
    ServiceDefinitions.UseCreateNewContentAction.id,
    { errorHandling: "reject-on-any-failure" },
  );

  if (isPending) {
    return <HvLoading>Loading create actions...</HvLoading>;
  }

  if (error) {
    const errorMessage = `Failed to load bundle type services: ${ServiceDefinitions.UseCreateNewContentAction.id}`;
    return <HvTypography>{errorMessage}</HvTypography>;
  }

  return <InstanceBundleServiceDemoInner actionHooks={actionHooks} />;
};

// The Notification component contract defines 'message' as mandatory prop. However, that is the contract of the service
// that providers should comply with and assuming that all providers are compliant, we need to use the Partial<>
// utility type instead because any explicit passed prop overrides the ones from configuration.
// This is required otherwise Typescript's type checker would complain about missing props if using the contract type: BasicNotification.
type NotificationComponent = FC<Partial<NotificationComponentProps>>;

const ComponentServiceDemo: FC = () => {
  const {
    service: Notification,
    isPending,
    error,
  } = useService<NotificationComponent>(
    ServiceDefinitions.BasicNotification.id,
  );

  if (isPending) {
    return <HvLoading>Loading component type services...</HvLoading>;
  }

  if (error) {
    const errorMessage = `Failed to load component type service: ${ServiceDefinitions.BasicNotification.id}`;
    return <HvTypography>{errorMessage}</HvTypography>;
  }

  return (
    <HvCard>
      <HvCardContent>
        <HvTypography variant="title3" style={{ marginBottom: "16px" }}>
          Component Service Demo
        </HvTypography>
        <HvTypography style={{ marginBottom: "16px" }}>
          This demonstrates a component service that renders React components.
        </HvTypography>
        <Notification />
      </HvCardContent>
    </HvCard>
  );
};

const ServicesDemo: FC = () => {
  return (
    <MainContainer>
      <HvTypography variant="title1" style={{ marginBottom: "32px" }}>
        Services Demo
      </HvTypography>

      <HvTypography style={{ marginBottom: "32px" }}>
        This page demonstrates some of the supported types of services through
        App Shell, namely Instance, Factory, and Component services.
      </HvTypography>

      <HvGrid container spacing={3}>
        <HvGrid item xs={12} md={6}>
          <InstanceServiceDemo />
        </HvGrid>

        <HvGrid item xs={12} md={6}>
          <FactoryServiceDemo />
        </HvGrid>

        <HvGrid item xs={12} md={6}>
          <InstanceBundleServiceDemo />
        </HvGrid>

        <HvGrid item xs={12} md={6}>
          <ComponentServiceDemo />
        </HvGrid>
      </HvGrid>
    </MainContainer>
  );
};

export default ServicesDemo;
