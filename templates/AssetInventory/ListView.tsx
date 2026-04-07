import {
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  type HvTableColumnConfig,
  type HvTableInstance,
} from "@hitachivantara/uikit-react-core";

import type { AssetInventoryEntry } from "./data";

interface ListViewProps {
  id?: string;
  columns: HvTableColumnConfig<AssetInventoryEntry, string>[];
  instance: HvTableInstance<AssetInventoryEntry, string>;
}

export const ListView = ({ id, instance, columns }: ListViewProps) => {
  return (
    <HvTableContainer style={{ padding: "2px" }} id={id}>
      <HvTable variant="listrow" {...instance.getTableProps()}>
        <HvTableHead>
          <HvTableRow>
            <HvTableCell variant="listcheckbox" />
            {columns.map((col) => (
              <HvTableHeader key={col.Header}>{col.Header}</HvTableHeader>
            ))}
          </HvTableRow>
        </HvTableHead>
        <HvTableBody withNavigation {...instance.getTableBodyProps()}>
          {instance.page.map((row) => {
            instance.prepareRow(row);
            const { key, ...rowProps } = row.getRowProps();
            return (
              <HvTableRow key={key} {...rowProps}>
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <HvTableCell key={cellKey} {...cellProps}>
                      {cell.render("Cell")}
                    </HvTableCell>
                  );
                })}
              </HvTableRow>
            );
          })}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );
};

export default ListView;
