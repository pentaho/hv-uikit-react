import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MetadataSection } from "./MetadataSection";

it("isn't expandable by default", () => {
  render(<MetadataSection title="TITLE">CONTENT</MetadataSection>);

  const expandButton = screen.queryByRole("button", { name: /collapse/i });
  expect(expandButton).not.toBeInTheDocument();
  expect(screen.getByText("TITLE")).toBeInTheDocument();
  expect(screen.getByText("CONTENT")).toBeInTheDocument();
});

it("renders & hides the content correctly when expandable", async () => {
  const title = "TITLE";
  const content = "CONTENT";
  render(
    <MetadataSection expandable title={title}>
      {content}
    </MetadataSection>,
  );

  const titleElement = screen.getByText(title);

  expect(titleElement).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /collapse/i })).toBeInTheDocument();
  expect(screen.getByText(content)).toBeInTheDocument();

  await userEvent.click(titleElement);
  expect(screen.queryByText(content)).not.toBeVisible();
});

it("saves & restores expanded state when storageId is provided", async () => {
  const storageId = "test-metadata-section";
  const title = "TITLE";
  const content = "CONTENT";

  const { unmount } = render(
    <MetadataSection storageId={storageId} title={title}>
      {content}
    </MetadataSection>,
  );

  // starts expanded by default
  expect(screen.getByText(content)).toBeVisible();
  expect(localStorage.getItem(storageId)).toBeNull();

  // collapse the section
  await userEvent.click(screen.getByText(title));
  expect(screen.queryByText(content)).not.toBeVisible();
  expect(localStorage.getItem(storageId)).toBe(JSON.stringify(false));

  unmount();

  // re-render: should restore the collapsed state from localStorage
  render(
    <MetadataSection storageId={storageId} title={title}>
      {content}
    </MetadataSection>,
  );
  expect(screen.queryByText(content)).not.toBeVisible();
});
