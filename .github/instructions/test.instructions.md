---
name: Component Testing Instructions
applyTo: "**/*.test.tsx"
---

- Use Vitest for testing.
- Use `@testing-library/react` for testing components and hooks.
- Use `screen` and semantic selectors (`*ByRole`, `*ByLabelText`) to query elements.
- Use `userEvent` for simulating user interactions instead of `fireEvent`.
- Focus tests on API & user behavior. DON'T test implementation details.

```tsx
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { MyForm } from "./MyForm";

it("submits the form when valid", async () => {
  const submitMock = vi.fn();
  render(<MyForm onSubmit={submitMock} />);

  const input = screen.getByRole("textbox", { name: /username/i });
  await userEvent.type(input, "testuser");

  const submitButton = screen.getByRole("button", { name: /submit/i });
  await userEvent.click(submitButton);

  expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
  expect(submitMock).toHaveBeenCalledWith({ username: "testuser" });
});
```
