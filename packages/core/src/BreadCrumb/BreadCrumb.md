---
component: HvBreadCrumb
status: stable
related: [HvGlobalActions, HvDropDownMenu, HvTabs]
rules: [uikit/raw-elements]
---

# HvBreadCrumb

The path from the top of a hierarchy to the current page, each level a link back up.

## When to use

- Detail pages two or more levels deep (Catalog / Domain / Asset), above the page title.
- A flat app with one level: no breadcrumb; switching peer views: HvTabs.

## What the consumer provides

- `listRoute` from the top to the current page, or `url` to build it from a URL's path.
- `onClick(event, item)` to route in-app (it prevents the link's default), or `component` for a router link.
- `home`: its default action is always prevented, so navigate in `onClick`.

## Spec

- Over `maxVisible` levels (at least 2), the first stays and the ones after it collapse into an HvDropDownMenu (dots icon), then the last levels follow. An empty `separator` shows a caret icon in `textSubtle`.
- Links in `captionLabel` at normal weight, `radii.base`, side padding `space.xxs`, `bgHover` on hover and focus; long labels truncate with a tooltip; `home` shows as a home icon titled with its `label`.
- Current page in `caption1` at semibold weight; a file extension in its label is dropped.

## Don't

- Don't make the current page a link: the last item renders as plain text, keep it that way.
- Don't leave the `nav` unnamed: it has no default name, so pass `aria-label="Breadcrumb"` (the current page gets no `aria-current`).
- Don't rely on it for sentence case: links capitalize every word (the current page keeps its label as written), so keep labels short nouns.
