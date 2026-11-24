# Form Rules

## Introduction

Forms say what information to provide and name each control.

## Form element

- Use a `<form>` element with the UI Kit form components, and handle submission with its `onSubmit` event.

Example:

```tsx
<form onSubmit={handleSubmit}>
  <HvInput required name="email" label="Email" type="email" />
  <HvInput required name="password" label="Password" type="password" />
  <HvCheckBox name="remember" label="Remember me" />
  <HvButton type="submit">Sign in</HvButton>
</form>
```

## Fields and actions

Each field carries its own `label`, `required` and `description`; `status="invalid"` comes with a `statusMessage` that says how to fix it, both controlled from the first render (`statusMessage=""` until there is one) or the message never shows. Form actions sit at the end: `secondaryGhost` Cancel, then the `primary` action.
