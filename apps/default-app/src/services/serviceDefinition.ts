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
export const ServiceDefinitions = {
  /**
   * The {@const UseCreateNewContentAction} service represents an action for
   * creating new content from the default-app application.
   *
   * Create new content actions are displayed on a menu or dropdown button.
   *
   * Instances of this service are React hook functions of type
   * {@link UseCreateNewContentAction}.
   */
  UseCreateNewContentAction: {
    id: "default-app/services:UseCreateNewContentAction",
  },

  /**
   * Simple data service that provides basic application configuration data.
   * Instance service type - provides a direct object instance.
   *
   * Service type: {@link SimpleDataService}
   */
  SimpleDataService: {
    id: "default-app/services:SimpleDataService",
  },

  /**
   * Message service created by a factory function with configuration.
   * Factory service type - creates service instances through a factory function.
   *
   * Factory function type: {@link CreateMessageService}
   * Service instance type: {@link MessageService}
   * Configuration type: {@link MessageServiceConfig}
   */
  MessageService: {
    id: "default-app/services:MessageService",
  },

  /**
   * Basic notification React component service.
   * Component service type - provides React components with props.
   *
   * Component type: {@link BasicNotification}
   * Props type: {@link NotificationComponentProps}
   */
  BasicNotification: {
    id: "default-app/services:BasicNotification",
  },
};
