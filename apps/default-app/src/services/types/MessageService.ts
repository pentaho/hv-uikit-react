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
export interface MessageServiceConfig {
  prefix?: string;
}

export interface MessageService {
  formatMessage: (message: string) => string;
  getWelcomeMessage: () => string;
}

export type CreateMessageService = (
  config?: MessageServiceConfig,
) => MessageService;
