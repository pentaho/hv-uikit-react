import { mergeConfig } from "tsdown";

import { baseConfig } from "../../.config/tsdown.config.ts";

export default mergeConfig(baseConfig, {
  copy: ["src/locales"],
  external: [/\/locales\/.*\.json$/],
});
