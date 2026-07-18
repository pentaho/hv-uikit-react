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
import type { MessageService, MessageServiceConfig } from "../types";

// Simple factory function that creates a message service
export default function createMessageService(
  config: MessageServiceConfig = {},
): MessageService {
  const prefix = config.prefix || "Message: ";

  return {
    formatMessage: (message: string) => `${prefix}${message}`,
    getWelcomeMessage: () => `${prefix}Welcome to the app!`,
  };
}
