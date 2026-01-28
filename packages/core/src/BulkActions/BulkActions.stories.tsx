import { useState } from "react";
import {
  HvActionGeneric,
  HvBulkActions,
  HvCheckBox,
} from "@hitachivantara/uikit-react-core";
import { Add, Delete, Preview } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const actions: HvActionGeneric[] = [
  { id: "add", label: "Add", icon: <Add /> },
  { id: "delete", label: "Delete", icon: <Delete /> },
  { id: "put", label: "Preview", icon: <Preview /> },
];

const meta = preview.meta({
  title: "Components/Bulk Actions",
  component: HvBulkActions,
  decorators: [(Story) => <div style={{ padding: 10 }}>{Story()}</div>],
});

type SampleComponentDatum = {
  id: string | number;
  value: string;
  checked: boolean;
};

type SampleComponentProps = {
  data: SampleComponentDatum[];
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    checked: boolean,
  ) => void;
};

const SampleComponent = ({ data, onChange }: SampleComponentProps) => (
  <div className="flex flex-wrap justify-center gap-xs">
    {data.map((el, i) => (
      <HvCheckBox
        className="flex justify-center w-160px p-xs rounded-4px bg-bgContainer"
        key={el.id}
        label={el.value}
        checked={el.checked}
        onChange={(e, checked) => onChange(e, i, checked)}
      />
    ))}
  </div>
);

export const Main = meta.story({
  args: {
    showSelectAllPages: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    onSelectAll: { control: { disable: true } },
    onSelectAllPages: { control: { disable: true } },
    checkboxProps: { control: { disable: true } },
  },
  render: (args) => {
    const addEntry = (i: number) => ({
      id: `val${i + 1}`,
      value: `Value ${i + 1}`,
      checked: false,
    });

    const [data, setData] = useState(() => [...Array(8).keys()].map(addEntry));

    const handleSelectAll = (_: any, checked = false) => {
      setData(data.map((el) => ({ ...el, checked })));
    };

    return (
      <>
        <HvBulkActions
          {...args}
          numTotal={data.length}
          numSelected={data.filter((el) => el.checked).length}
          actions={actions}
          onSelectAll={handleSelectAll}
          onSelectAllPages={(e) => handleSelectAll(e, true)}
          maxVisibleActions={1}
        />
        <SampleComponent
          data={data}
          onChange={(_, i, checked) => {
            const newData = [...data];
            newData[i].checked = checked;
            setData(newData);
          }}
        />
      </>
    );
  },
});

export const Test = meta.story({
  render: () => (
    <>
      <HvBulkActions
        numTotal={10}
        numSelected={0}
        actions={actions}
        maxVisibleActions={2}
        showSelectAllPages
      />
      <HvBulkActions
        numTotal={10}
        numSelected={5}
        actions={actions}
        maxVisibleActions={2}
        showSelectAllPages
      />
      <HvBulkActions
        numTotal={10}
        numSelected={5}
        actions={actions}
        maxVisibleActions={2}
      />
    </>
  ),
});
