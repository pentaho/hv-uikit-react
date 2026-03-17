---
applyTo: "packages/*/**/*.styles.ts,packages/*/**/*.styles.tsx"
name: Component Styling Instructions
---

## Example

```ts
// HvComp.styles.ts
import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

export const { staticClasses, useClasses } = createClasses("HvComp", {
  /** Applied to the root element */
  root: {
    padding: theme.spacing("xs", "sm"), // 👈 leverage the `theme.` object
    marginTop: theme.space.sm,
    backgroundColor: theme.colors.backgroundColor,
  },
  /** Applied to the root element when selected */
  selected: {},
  /** Applied to the root element when disabled */
  disabled: {
    // 👇 leverage global `disabled` instead of adding a `buttonDisabled`
    "& $button": {
      cursor: "not-allowed",
    },
  },
  /** Applied to the button element */
  button: {},
});
```
