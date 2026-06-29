---
name: ui-unit-testing
description: "Behavior-first testing guidelines for creating useful and resilient tests for React apps and components. Use when writing or reviewing Vitest + Testing Library tests."
argument-hint: "Describe/Link the component to test"
---

# UI Testing Guidelines

## Core Principles

- Use `vitest` and `@testing-library/react` for testing.
- Use `screen` and semantic selectors (`*ByRole`, `*ByLabelText`) to query elements.
- Use `userEvent` for simulating user interactions instead of `fireEvent`.
- Focus tests on public/exported API & user behavior. DON'T test implementation details.
- DON'T mock internal components from the same package.
- DON'T test className or other styles. Visual tests are covered by Storybook + Chromatic.

## Query Priority

Use this order for selectors:

1. `*ByRole` with accessible name
2. `*ByLabelText` or `*ByText`, `*ByPlaceholderText` for text-based labels
3. `*ByTextId` AVOID if possible, only use when no other query is available

## Example

```tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { expect, it, vi } from "vitest";

import { MyForm } from "./MyForm";

// short and descriptive 👇 test name focused on the behavior
it("submits the form when valid", async () => {
  const submitMock = vi.fn();
  render(<MyForm onSubmit={submitMock} />);

  // prefer the `screen.*byRole` queries
  const input = screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(input, "testUser");

  const submitButton = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submitButton);

  // assert the user-observable UI changes
  expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
  expect(submitMock).toHaveBeenCalledWith({ username: "testUser" });
});
```
