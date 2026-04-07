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
