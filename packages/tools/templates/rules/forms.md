# Form Rules

## Introduction

- Forms must make it clear what information users need to provide and how to identify each control.
- Forms should use a form element and the UI Kit form components whenever possible to ensure consistency, accessibility, and theme support.
- Handle the native form submission using the `onSubmit` event.

Example:

```tsx
<form onSubmit={handleSubmit}>
  <HvInput required name="email" label="Email" type="email" />
  <HvInput required name="password" label="Password" type="password" />
  <HvCheckBox name="remember" label="Remember me" />
  <HvButton type="submit">Sign In</HvButton>
</form>
```
