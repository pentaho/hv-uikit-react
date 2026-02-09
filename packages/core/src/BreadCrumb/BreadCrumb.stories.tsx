import { expect, within } from "storybook/test";

import preview from "../../../../.storybook/preview";
import { HvBreadCrumb } from "./BreadCrumb";

const data = [
  { label: "Label 1", path: "route1" },
  { label: "Label 2", path: "route2" },
  { label: "Label 3", path: "route3" },
  { label: "Label 4", path: "route4" },
  { label: "Label 5", path: "route5" },
  { label: "Label 6", path: "route6" },
  { label: "Label 7", path: "route7" },
  { label: "Label 8", path: "route8" },
  { label: "Label 9", path: "route9" },
];

const meta = preview.meta({
  title: "Components/Breadcrumb",
  component: HvBreadCrumb,
  argTypes: {
    onClick: { action: "clicked" },
  },
});

export const Main = meta.story({
  args: {
    maxVisible: 5,
  },
  argTypes: {
    classes: { control: { disable: true } },
    listRoute: { control: { disable: true } },
    component: { control: { disable: true } },
    dropDownMenuProps: { control: { disable: true } },
    maxVisible: { control: { type: "range", min: 0, max: data.length } },
  },
  render: (args) => {
    return <HvBreadCrumb listRoute={data} aria-label="Breadcrumb" {...args} />;
  },
});

export const WithURL = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Breadcrumb sample that generates the paths using an URL",
      },
    },
  },
  render: (args) => {
    return (
      <HvBreadCrumb
        url="https://hitachivantara.sharepoint.com/sites/DesignSystem/Pattern%20Library/Home.aspx"
        aria-label="Breadcrumb"
        {...args}
      />
    );
  },
});

export const Test = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Breadcrumb with long labels.",
      },
    },
  },
  // For a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    await userEvent.click(canvas.getByRole("button", { name: /dropdown/i }));
    await expect(await canvas.findByRole("menu")).toBeInTheDocument();
  },
  decorators: [(Story) => <div className="grid gap-sm">{Story()}</div>],
  render: () => (
    <>
      <HvBreadCrumb
        aria-label="Test link"
        url="https://example.com/sites/subpath/anotherPath/leaf.aspx"
      />
      <HvBreadCrumb aria-label="Test" maxVisible={4} listRoute={data} />
      <HvBreadCrumb
        aria-label="Test long"
        listRoute={[...Array(5).keys()].map((i) => ({
          label: `Long label ${i + 1} With Some Long Text`,
          path: `route${i}`,
        }))}
      />
    </>
  ),
});
