import { useId, useMemo, useState } from "react";
import {
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvControls,
  HvLeftControl,
  HvListContainer,
  HvListItem,
  HvPanel,
  HvRightControl,
  HvSimpleGrid,
  useHvGlobalFilter,
  useHvSortBy,
  useHvTable,
  type HvControlsViewConfiguration,
  type HvRightListControls,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import { Cards, List } from "@hitachivantara/uikit-react-icons";

const getOption = (opts: string[], i: number) => opts[i % opts.length];

const newEntry = (i: number) => ({
  id: `${i + 1}`,
  name: `Event ${i + 1}`,
  eventType: `Anomaly detection ${i % 4}`,
  status: getOption(["Closed", "Open"], i),
  severity: getOption(["Critical", "Major", "Average", "Minor"], i),
  temperature: `${i + 35}`,
});

type NewEntry = ReturnType<typeof newEntry>;

const views: HvControlsViewConfiguration[] = [
  {
    id: "card",
    icon: <Cards />,
    "aria-label": "Select card view",
    label: "Select card view",
  },
  {
    id: "list",
    icon: <List />,
    "aria-label": "Select list view",
    label: "Select list view",
  },
];

const columns: HvTableColumnConfig<NewEntry>[] = [
  { Header: "Title", accessor: "name", style: { minWidth: 220 } },
  { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
  { Header: "Status", accessor: "status", style: { width: 120 } },
  { Header: "Severity", accessor: "severity" },
  { Header: "Temperature", accessor: "temperature" },
];

const rightControls: HvRightListControls[] = [
  {
    id: "nameAsc",
    accessor: "name",
    label: "Name Ascending",
    desc: false,
  },
  {
    id: "nameDesc",
    accessor: "name",
    label: "Name Descending",
    desc: true,
  },
  {
    id: "eventTypeAsc",
    accessor: "eventType",
    label: "Event Type Ascending",
    desc: false,
  },
  {
    id: "eventTypeDesc",
    accessor: "eventType",
    label: "Event Type Descending",
    desc: true,
  },
  {
    id: "severityAsc",
    accessor: "severity",
    label: "Severity Ascending",
    desc: false,
  },
  {
    id: "severityDesc",
    accessor: "severity",
    label: "Severity Descending",
    desc: true,
  },
];

export const Controls = () => {
  const originalData = useMemo(() => [...Array(10).keys()].map(newEntry), []);
  const [currentView, setCurrentView] = useState("card");
  const [data] = useState(originalData);

  const cardsId = useId();
  const listsId = useId();

  const { rows, setGlobalFilter, setSortBy } = useHvTable<NewEntry>(
    { data, columns },
    useHvGlobalFilter,
    useHvSortBy,
  );

  return (
    <div className="grid gap-xs">
      <HvControls
        views={views}
        defaultView="card"
        callbacks={{ setGlobalFilter, setSortBy }}
        onViewChange={(evt, id) => setCurrentView(id)}
      >
        <HvLeftControl
          placeholder="Search"
          searchProps={{
            inputProps: {
              "aria-label": "Search",
              "aria-controls": `${cardsId} ${listsId}`,
            },
          }}
        />
        <HvRightControl
          values={rightControls}
          sortProps={{
            "aria-label": "Sort by",
            "aria-controls": `${cardsId} ${listsId}`,
          }}
        />
      </HvControls>
      {currentView === "card" && (
        <HvSimpleGrid id={cardsId} cols={3}>
          {rows?.map(({ values }) => (
            <HvCard bgcolor="bgContainer" key={values?.name} className="w-full">
              <HvCardHeader title={values?.name} />
              <HvCardContent>Event: {values?.eventType}</HvCardContent>
              <HvCardContent>Severity: {values?.severity}</HvCardContent>
            </HvCard>
          ))}
        </HvSimpleGrid>
      )}
      {currentView === "list" && (
        <HvPanel id={listsId} className="float-left">
          <HvListContainer condensed>
            {rows?.map(({ values }) => (
              <HvListItem key={values?.name} className="w-full">
                Name: {values?.name}
              </HvListItem>
            ))}
          </HvListContainer>
        </HvPanel>
      )}
    </div>
  );
};
