# HV UI Kit Form Rules

## Labels

- Every input must have a label or `aria-label`
  ```tsx
  <HvInput label="Name" />  // or
  <HvInput aria-label="Search" placeholder="Type..." />
  ```

## Example: Building a Form

```tsx
import { HvButton, HvCheckBox, HvInput } from "@pentaho/uikit-react-core";

export function LoginForm() {
  return (
    <form>
      {/* Input with label (a11y requirement) */}
      <HvInput label="Email" type="email" required />

      {/* Checkbox with label (a11y requirement) */}
      <HvCheckBox label="Remember me" />

      {/* Primary button for form submission */}
      <HvButton variant="primary" type="submit">
        Sign In
      </HvButton>
    </form>
  );
}
```

Run validation:

```bash
npx uikit-tools validate LoginForm.tsx
# ✓ All validations passed
```
