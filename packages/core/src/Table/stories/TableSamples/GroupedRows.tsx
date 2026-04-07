import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  theme,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";

import { makeData, type AssetEvent } from "../storiesUtils";

const style = {
  borderRight: `1px solid ${theme.colors.border}`,
};

const getGroupedRowsColumns = (): HvTableColumnConfig<AssetEvent, string>[] => [
  { Header: "Title", accessor: "name", style: { minWidth: 120 } },
  { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
  { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
  { Header: "Status", accessor: "status", style: { width: 140 } },
  {
    Header: "Probability",
    accessor: "riskScore",
    align: "right", // numeric values should be right-aligned
    Cell: ({ value }) => `${value}%`,
    aggregate: "average",
    Aggregated: ({ value }) => `Avg. ${value}%`,
  },
  { Header: "Severity", accessor: "severity" },
  { Header: "Priority", accessor: "priority" },
];

export const GroupedRows = () => {
  const columns = getGroupedRowsColumns();
  const data = makeData(8);

  return (
    <HvTableContainer>
      <HvTable>
        <HvTableHead>
          <HvTableRow>
            {columns.map((el, index) => (
              <HvTableHeader key={el.Header} {...(index === 0 && { style })}>
                {el.Header}
              </HvTableHeader>
            ))}
          </HvTableRow>
        </HvTableHead>
        <HvTableBody>
          {data.map((el, index) => (
            <HvTableRow key={el.id}>
              {index % 3 === 0 && (
                <HvTableCell rowSpan={3} style={style}>
                  {el.name}
                </HvTableCell>
              )}
              <HvTableCell>{el.createdDate}</HvTableCell>
              <HvTableCell>{el.eventType}</HvTableCell>
              <HvTableCell>{el.status}</HvTableCell>
              <HvTableCell>{el.riskScore}</HvTableCell>
              <HvTableCell>{el.severity}</HvTableCell>
              <HvTableCell>{el.priority}</HvTableCell>
            </HvTableRow>
          ))}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );
};
