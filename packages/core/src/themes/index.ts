import { ds3 } from "./ds3";
import { ds5 } from "./ds5";
import { pentahoPlus } from "./pentahoPlus";

// TODO: Temporary support for "pentaho" theme alias. To be removed in v6.
const pentaho = pentahoPlus;

export { ds3, ds5, pentaho, pentahoPlus };
export const themes = { ds3, ds5, pentahoPlus, pentaho };
