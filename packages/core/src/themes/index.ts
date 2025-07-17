import { ds5 } from "./ds5";
import { pentahoPlus } from "./pentahoPlus";

// TODO: Temporary support for "pentaho" theme alias. To be removed in v6.
const pentaho = pentahoPlus;

export { ds5, pentaho, pentahoPlus };
export const themes = { ds5, pentahoPlus, pentaho };
