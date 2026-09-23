# HV UI Kit Accessibility Rules

Images and avatars need an accessible name. Form labels are covered in the Forms rules.

## Images and Avatars

- Always include `alt` or `aria-label`
  ```tsx
  <HvAvatar src="user.jpg" alt="John Doe" />
  ```
