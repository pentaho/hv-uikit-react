import type { StoryObj } from "@storybook/react-vite";

import { CompleteTableSection } from "./CompleteTableSection";
import { PropsTableSection } from "./PropsTableSection";
import { SimpleTableSection } from "./SimpleTableSection";
import { TableEditable } from "./TableEditable";
import { TableFilter } from "./TableFilter";

export default {
  title: "Visualizations/Table/Table Section",
};

export const SimpleTable: StoryObj = {
  render: () => <SimpleTableSection />,
};

export const CompleteTable: StoryObj = {
  render: () => <CompleteTableSection />,
};

export const PropsTable: StoryObj = {
  render: () => <PropsTableSection />,
};

export const Editable: StoryObj = {
  render: () => <TableEditable />,
};

export const Filter: StoryObj = {
  render: () => <TableFilter />,
};
