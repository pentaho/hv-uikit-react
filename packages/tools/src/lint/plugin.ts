/**
 * The UI Kit lint rules as one plugin, for oxlint (`jsPlugins`, see `oxlint.json`) and ESLint (`plugins: { uikit }`).
 * Rule ids are `uikit/<name>`; design notes and rule files cite them.
 */
import { markupRules } from "./markup.js";
import { ruleId, type LintRule } from "./rule.js";
import { themeRules } from "./theme.js";

export const RULES: LintRule[] = [...markupRules, ...themeRules];

const plugin = {
  meta: { name: "uikit" },
  rules: Object.fromEntries(
    RULES.map((r) => [
      r.name,
      {
        meta: { type: "problem", docs: { description: r.say } },
        create: r.create,
      },
    ]),
  ),
  configs: {
    recommended: {
      plugins: ["uikit"],
      rules: Object.fromEntries(RULES.map((r) => [ruleId(r), "error"])),
    },
  },
};

export default plugin;
