import { StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableProps,
  HvTableRow,
} from "@hitachivantara/uikit-react-core";

import { AllColumnRenderers } from "./AllColumnRenderers";
import { ColumnResize } from "./TableHooks/ColumnResize";
import { TestStickyHeaders as TestHeadersStory } from "./TableHooks/TableHooks.stories";
import { UseHvGroupBy } from "./TableHooks/UseHvGroupBy";
import { CompleteTableSection } from "./TableSamples/CompleteTableSection";
import { GroupedRows as GroupedRowsStory } from "./TableSamples/GroupedRows";
import { ListRow as ListRowStory } from "./TableSamples/ListRow";
import { Main as MainStory } from "./TableSamples/Main";
import { NoData as NoDataStory } from "./TableSamples/NoData";
import { SimpleTable as SimpleTableStory } from "./TableSamples/SimpleTable";
import { TableEditable } from "./TableSamples/TableEditable";

export default {
  title: "Visualizations/Table",
  tags: ["skipTestRunner"],
  component: HvTable,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: {
    HvTableContainer,
    HvTableRow,
    HvTableHead,
    HvTableHeader,
    HvTableBody,
    HvTableCell,
  },
};

export const Main: StoryObj<HvTableProps> = {
  args: {
    stickyColumns: false,
    stickyHeader: false,
    variant: "default",
  },
  argTypes: {
    classes: { control: { disable: true } },
    component: { control: { disable: true } },
  },
  render: (args) => <MainStory {...args} />,
};

export const NoData: StoryObj<HvTableProps> = {
  parameters: {
    docs: {
      description: {
        story: "Table with no data available.",
      },
    },
  },
  render: () => <NoDataStory />,
};

export const SimpleTable: StoryObj<HvTableProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Simple table that uses `HvTable` features in order to style checkbox and secondary actions columns.",
      },
    },
  },
  render: () => <SimpleTableStory />,
};

export const GroupedRows: StoryObj<HvTableProps> = {
  parameters: {
    docs: {
      description: {
        story: "A table example with grouped rows.",
      },
    },
  },
  render: () => <GroupedRowsStory />,
};

export const ListRow: StoryObj<HvTableProps> = {
  parameters: {
    docs: {
      description: {
        story: "List row variant of the table.",
      },
    },
  },
  render: () => <ListRowStory />,
};

export const Renderers: StoryObj = {
  render: () => <AllColumnRenderers />,
};

export const CompleteTable: StoryObj = {
  render: () => <CompleteTableSection />,
};

export const Editable: StoryObj = {
  render: () => <TableEditable />,
};

export const Test: StoryObj = {
  parameters: {
    ...setupChromatic("all"),
  },
  play: async ({ canvas, userEvent }) => {
    // Group by
    await userEvent.click(
      canvas.getAllByRole("button", { name: /collapse/i })[0],
    );

    await userEvent.click(canvas.getByRole("checkbox", { name: "0 / 64" }));
  },
  render: (args, context) => (
    <>
      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-sm">
          <SimpleTableStory />
          <UseHvGroupBy />
          <GroupedRowsStory />
          <ListRowStory />
        </div>
        <div className="flex flex-col gap-sm">
          <NoDataStory />
          <ColumnResize />
          {TestHeadersStory.render?.(TestHeadersStory.args!, context)}
          <CompleteTableSection />
        </div>
      </div>
      <br />
      <AllColumnRenderers />
    </>
  ),
};
