import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { TagsList } from "./TagsList";

const TAGS = [
  { id: "1", label: "Tag 1" },
  { id: "2", label: "Tag 2" },
  { id: "3", label: "Tag 3" },
];

beforeEach(() => {
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockReturnValue({
    width: 60,
    height: 24,
    top: 0,
    left: 0,
    bottom: 24,
    right: 60,
    x: 0,
    y: 0,
    toJSON: vi.fn(),
  } as DOMRect);
});

afterEach(() => vi.restoreAllMocks());

it("renders all tags", async () => {
  render(<TagsList tags={TAGS} />);
  await waitFor(() => expect(screen.getAllByText("Tag 1").length).toBe(2));
  expect(screen.getAllByText("Tag 2").length).toBe(2);
  expect(screen.getAllByText("Tag 3").length).toBe(2);
});

it("calls onDelete with the tag id when the tag is deleted", async () => {
  const onDelete = vi.fn();
  render(<TagsList tags={TAGS} onDelete={onDelete} />);

  await waitFor(() => expect(screen.getAllByText("Tag 1").length).toBe(2));
  const tag = screen.getAllByText("Tag 1")[0];
  await userEvent.type(tag, "{backspace}");
  expect(onDelete).toHaveBeenCalledWith("1");
});

it("does not call onDelete when readOnly is true", async () => {
  const onDelete = vi.fn();
  render(<TagsList tags={TAGS} onDelete={onDelete} readOnly />);

  await waitFor(() => expect(screen.getAllByText("Tag 1").length).toBe(2));
  const tag = screen.getAllByText("Tag 1")[0];
  await userEvent.type(tag, "{backspace}");
  expect(onDelete).not.toHaveBeenCalled();
});
