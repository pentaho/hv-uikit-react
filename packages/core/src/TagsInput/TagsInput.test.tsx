import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HvTagsInput } from ".";
import { ControlledTagArray } from "./stories/ControlledTagArray";

describe("TagsInput examples", () => {
  describe("<ControlledTagArray />", () => {
    it("should clear the input whenever a tags gets added", async () => {
      render(<ControlledTagArray />);
      const uncommittedText = "uncommitted text";
      let clickableButtons = screen.getAllByRole("button");

      expect(clickableButtons.length).toBe(5);
      const addTagButton = screen.getByText("Add tags");
      const tagsInput = screen.getByRole("textbox");

      fireEvent.change(tagsInput, { target: { value: uncommittedText } });
      expect(tagsInput).toHaveValue(uncommittedText);
      expect(clickableButtons.length).toBe(5);

      fireEvent.click(addTagButton);
      clickableButtons = await screen.findAllByRole("button");
      expect(clickableButtons.length).toBe(6);
      expect(tagsInput).not.toHaveValue(uncommittedText);
    });

    it("should retain uncommitted text when deleting tags", async () => {
      render(<ControlledTagArray />);

      const uncommittedText = "uncommitted text";
      const clickableButtons = screen.getAllByRole("button");
      expect(clickableButtons.length).toBe(5);
      const tagsInput = screen.getByRole("textbox");

      fireEvent.change(tagsInput, { target: { value: uncommittedText } });
      expect(tagsInput).toHaveValue(uncommittedText);
      expect(clickableButtons.length).toBe(5);

      const lastTag = clickableButtons[4];
      fireEvent.click(lastTag.querySelector("[data-name=Close]")!);

      expect((await screen.findAllByRole("button")).length).toBe(4);
      expect(tagsInput).toHaveValue(uncommittedText);
    });
  });
});

describe("TagsInput Component", () => {
  beforeEach(async () => {
    vi.useRealTimers();
  });

  it("should render the label correctly", () => {
    render(<HvTagsInput label="Custom label" />);
    expect(screen.getByText("Custom label")).toBeInTheDocument();
  });

  it("should render the text area with tags when controlled and input value is an array of strings", () => {
    render(<HvTagsInput label="Custom label" value={["tag1", "tag2"]} />);

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    const clickableButtons = screen.getAllByRole("button");
    expect(clickableButtons.length).toBe(2);
  });

  it("should render the text area with tags when controlled and input value is an array of tags", () => {
    render(
      <HvTagsInput
        label="Custom label"
        value={[{ label: "tag1" }, { label: "tag2" }]}
      />,
    );

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    const clickableButtons = screen.getAllByRole("button");
    expect(clickableButtons.length).toBe(2);
  });

  it("renders a custom adornment", () => {
    render(
      <HvTagsInput
        startAdornment={<div>startAdornment</div>}
        endAdornment={<div>endAdornment</div>}
      />,
    );

    expect(screen.getByText("startAdornment")).toBeInTheDocument();
    expect(screen.getByText("endAdornment")).toBeInTheDocument();
  });

  it("should trigger the delete callback on click", async () => {
    const onChangeSpy = vi.fn();
    const onDeleteSpy = vi.fn();

    render(
      <HvTagsInput
        label="Custom label"
        value={[{ label: "tag1" }, { label: "tag2" }]}
        onChange={onChangeSpy}
        onDelete={onDeleteSpy}
      />,
    );

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    const clickableButtons = screen.getAllByRole("button");
    expect(clickableButtons.length).toBe(2);
    const [, tag2] = clickableButtons;
    fireEvent.click(tag2.querySelector("[data-name=Close]")!);

    const remainingButtons = await screen.findAllByRole("button");
    expect(onChangeSpy).toHaveBeenCalledWith(expect.any(Object), [
      { label: "tag1" },
    ]);
    expect(onDeleteSpy).toHaveBeenCalledWith(
      expect.any(Object),
      { label: "tag2" },
      1,
    );

    // the value is controlled so it should not change only inform
    expect(remainingButtons.length).toBe(2);
  });

  it("should trigger the add callback", async () => {
    const onChangeSpy = vi.fn();
    const onAddSpy = vi.fn();
    render(
      <HvTagsInput
        label="Custom label"
        value={[{ label: "tag1" }, { label: "tag2" }]}
        onChange={onChangeSpy}
        onAdd={onAddSpy}
      />,
    );

    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    const clickableButtons = screen.getAllByRole("button");
    const tagsInput = screen.getByRole("textbox");
    fireEvent.change(tagsInput, { target: { value: "tag3" } });
    expect(tagsInput).toHaveValue("tag3");
    expect(clickableButtons.length).toBe(2);
    fireEvent.keyDown(tagsInput, { code: "Enter", keyCode: 13 });
    const remainingButton = await screen.findAllByRole("button");
    expect(onChangeSpy).toHaveBeenCalledWith(expect.any(Object), [
      { label: "tag1" },
      { label: "tag2" },
      { label: "tag3", type: "semantic" },
    ]);
    expect(onAddSpy).toHaveBeenCalledWith(
      expect.any(Object),
      { label: "tag3", type: "semantic" },
      2,
    );
    // the value is controlled so it should not change only inform
    expect(remainingButton.length).toBe(2);
  });

  it("should trigger the onBlur callback", async () => {
    vi.useFakeTimers();
    const onChangeSpy = vi.fn();
    const onBlurSpy = vi.fn();
    render(
      <HvTagsInput
        label="Custom label"
        value={[{ label: "tag1" }, { label: "tag2" }]}
        onChange={onChangeSpy}
        onBlur={onBlurSpy}
      />,
    );
    const { parentElement } = screen.getByText("Custom label");
    // @ts-ignore
    const { parentElement: formContainer } = parentElement;
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    const clickableButtons = screen.getAllByRole("button");
    const tagsInput = screen.getByRole("textbox");
    fireEvent.change(tagsInput, { target: { value: "tag3" } });
    expect(tagsInput).toHaveValue("tag3");
    expect(clickableButtons.length).toBe(2);
    fireEvent.blur(formContainer);
    vi.runAllTimers();
    // const remainingButton = await findAllByRole("button");
    expect(onBlurSpy).toHaveBeenCalledWith(expect.any(Object), "tag3");
    expect(onChangeSpy).not.toHaveBeenCalled();
    expect(tagsInput).toHaveValue("tag3");
    // // the value is controlled so it should not change only inform
    // expect(remainingButton.length).toBe(2);
  });

  it("should have a disabled tag if the `disabled` property is set to true", () => {
    render(
      <HvTagsInput
        label="Custom label"
        disabled
        value={[
          { label: "tag1", disabled: true },
          { label: "tag2", type: "categorical", disabled: true },
        ]}
      />,
    );

    const input = screen.queryByRole("textbox");
    expect(input).toBeNull();
  });

  it("should not display close buttons on readOnly tags", () => {
    render(
      <HvTagsInput label="Custom label" readOnly value={[{ label: "tag1" }]} />,
    );

    const input = screen.queryByRole("textbox");
    expect(input).toBeNull();

    const clickableButtons = screen.queryAllByRole("button");
    expect(clickableButtons.length).toBe(0);

    // in readonly mode the button shouldn't have the close icon
    expect(document.querySelector("[data-name=Close]")).toBeNull();
  });

  it("should call the suggestions callback when the input is changed", () => {
    const suggestionHandler = vi.fn();

    render(
      <HvTagsInput
        label="Custom label"
        value={[{ label: "tag1" }, { label: "tag2" }]}
        suggestionListCallback={suggestionHandler}
      />,
    );

    const tagsInput = screen.getByRole("textbox");

    fireEvent.change(tagsInput, { target: { value: "a" } });
    expect(suggestionHandler).toHaveBeenCalled();
  });
});
