import type { Reducer } from "react";

import type { HvQueryBuilderQueryRule, Query, QueryAction } from "../types";
import { emptyGroup, emptyRule, findNodeById, findParentById } from "./index";

const reducer: Reducer<Query, QueryAction> = (state, action) => {
  const query = structuredClone(state);

  switch (action.type) {
    case "reset-query": {
      return emptyGroup();
    }
    case "set-query":
      return action.query;
    case "reset-group": {
      const group = findNodeById(action.id, query);
      if (group && "rules" in group) {
        group.rules = [emptyRule()];

        return query;
      }
      break;
    }
    case "add-rule": {
      const group = findNodeById(action.id, query);
      if (group && "rules" in group) {
        const rule = emptyRule();

        group.rules.push(rule);

        return query;
      }
      break;
    }
    case "add-group": {
      const group = findNodeById(action.id, query);
      if (group && "rules" in group) {
        group.rules.push(emptyGroup(true));

        return query;
      }
      break;
    }
    case "remove-node": {
      const parent = findParentById(action.id, query);
      if (parent) {
        parent.rules = parent.rules.filter((rule) => rule.id !== action.id);

        return query;
      }

      // reset query if deleting top node
      return emptyGroup();
    }
    case "set-combinator": {
      const node = findNodeById(action.id, query);
      if (node && "combinator" in node) {
        if (node.combinator !== action.combinator) {
          node.combinator = action.combinator;

          return query;
        }
      }
      break;
    }
    case "set-attribute": {
      const node = findNodeById(action.id, query) as HvQueryBuilderQueryRule;
      if (node && node.attribute !== action.attribute) {
        node.attribute = action.attribute ?? undefined;

        // we keep the operator and value unless the operator is explicitly null (or set)
        if (action.operator !== undefined) {
          node.operator = action.operator ?? undefined;
          node.value = action.value ?? undefined;
        }

        return query;
      }
      break;
    }
    case "set-operator": {
      const node = findNodeById(action.id, query);
      if (node && "attribute" in node) {
        if (node.operator !== action.operator) {
          // @ts-ignore
          node.operator = action.operator;
          if (action.value !== undefined) {
            node.value = action.value ?? undefined;
          }

          return query;
        }
      }
      break;
    }
    case "set-value": {
      const node = findNodeById(action.id, query);
      if (node && "operator" in node) {
        // Making sure we are not adding "value: undefined" to the object when value wasn't even set (because of EmptyValue)
        // Without this we can trigger onChange
        if ("value" in node) {
          node.value = action.value ?? undefined;
        }

        return query;
      }
      break;
    }

    default:
  }

  // Return existing state if nothing changed
  return query;
};

export default reducer;
