---
component: HvList
status: prefer-alternative
related: [HvListContainer, HvListItem, HvSelectionList, HvDropDownMenu]
rules: [uikit/deprecated]
---

# HvList

Deprecated: a list rendered from a `values` array; compose HvListContainer and HvListItem instead.

## When to use

- Not for new projects: HvListContainer + HvListItem for display lists, HvSelectionList for picking, HvDropDownMenu for action menus.

## Don't

- Don't start new screens on it: the library marks it deprecated (`uikit/deprecated`).
