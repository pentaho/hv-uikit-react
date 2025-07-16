export const setId = (...args: any[]) =>
  args.some((arg) => arg == null) ? undefined : args.join("-");
