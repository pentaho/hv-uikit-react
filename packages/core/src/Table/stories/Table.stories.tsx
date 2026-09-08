import type { StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@pentaho/internal";
import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  type HvTableProps,
} from "@pentaho/uikit-react-core";

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

/** Table with no data available. */
export const NoData: StoryObj<HvTableProps> = {
  render: () => <NoDataStory />,
};

/** List row variant of the table. */
export const ListRow: StoryObj<HvTableProps> = {
  render: () => <ListRowStory />,
};
export const CompleteTable: StoryObj = {
  render: () => <CompleteTableSection />,
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
