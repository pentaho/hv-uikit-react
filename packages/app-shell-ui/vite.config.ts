import { mergeConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import viteConfig from "../../.config/vite.config";

export default mergeConfig(viteConfig, {
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "src/locales", dest: "locales", rename: { stripBase: 2 } },
      ],
    }),
  ],
  build: {
    rolldownOptions: {
      // Exclude locale JSON files from the module graph.
      // They are copied to dist/locales/ by viteStaticCopy and
      // only imported statically for the pre-bundled en fallback.
      external: [/\/locales\/.*\.json$/],
    },
  },
});
