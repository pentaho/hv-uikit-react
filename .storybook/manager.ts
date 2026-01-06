import { addons } from "storybook/manager-api";

import { getInitialMode } from "./decorators/utils";
import { themes } from "./theme";

const initialMode = getInitialMode();

addons.setConfig({
  theme: themes[initialMode],
  panelPosition: "bottom",
  enableShortcuts: true,
  showNav: true,
  showPanel: true,
});
