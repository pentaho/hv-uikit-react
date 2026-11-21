# Form Rules

## Form element

- Use a `<form>` element with the UI Kit form components, and handle submission with its `onSubmit` event; read the values from state, since not every UI Kit control writes itself into `FormData`.

## Fields and actions

- Each field carries its own `label`, `required` and `description`.
- Validate one way per field: the built-in checks (`required`, `validation`), or a controlled `status` with a `statusMessage` that says how to fix it (`uikit-tools info HvInput` for how to control it); not both.
- On submit, and on Next in a step, every empty required field gets `status="invalid"` and its `statusMessage`, and the first takes focus; the submit button isn't disabled to hide them.
- Form actions sit at the end: `secondaryGhost` Cancel, then the `primary` action.
- A long form is grouped: an `HvSection` per group with a `title4` heading.
