import { mergeConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

import viteConfig from "../../.config/vite.config";

export default mergeConfig(viteConfig, {
  plugins: [
    viteStaticCopy({
      targets: [{ src: "sprites", dest: "./" }],
    }),
  ],
});
