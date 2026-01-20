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
import { GroupedRows as GroupedRowsStory } from "./TableSamples/GroupedRows";
import { ListRow as ListRowStory } from "./TableSamples/ListRow";
import { Main as MainStory } from "./TableSamples/Main";
import { NoData as NoDataStory } from "./TableSamples/NoData";
import { ResponsiveTable as ResponsiveTableStory } from "./TableSamples/ResponsiveTable";
import { SimpleTable as SimpleTableStory } from "./TableSamples/SimpleTable";
import { PropsTableSection } from "./TableSection/PropsTableSection";

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

export const ResponsiveTable: StoryObj<HvTableProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "A table with non-table elements and responsive layout (try resizing your browser).",
      },
    },
  },
  render: () => <ResponsiveTableStory />,
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

export const TableRenderers: StoryObj = {
  render: () => <AllColumnRenderers />,
};

export const Test: StoryObj = {
  parameters: {
    ...setupChromatic("all"),
  },
  play: async ({ canvas, userEvent }) => {
    // Group by
    const collapseButton = canvas.getAllByRole("button", {
      name: /collapse/i,
    })[0];
    await userEvent.click(collapseButton);
  },
  render: (args, context: any) => (
    <>
      <div className="grid grid-cols-2 gap-sm">
        <div className="flex flex-col gap-sm">
          {Main.render?.(Main.args as any, context)}
          <UseHvGroupBy />
          {GroupedRows.render?.(GroupedRows.args as any, context)}
          {SimpleTable.render?.(SimpleTable.args as any, context)}
        </div>
        <div className="flex flex-col gap-sm">
          {NoData.render?.(NoData.args as any, context)}
          <ColumnResize />
          {TestHeadersStory.render?.(TestHeadersStory.args as any, context)}
          <PropsTableSection />
          {ListRow.render?.(ListRow.args as any, context)}
        </div>
      </div>
      <br />
      <AllColumnRenderers />
    </>
  ),
};
