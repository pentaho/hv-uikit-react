import { useMemo, useState } from "react";
import {
  HvButton,
  HvCheckBox,
  HvDropDownMenu,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableColumnConfig,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
} from "@hitachivantara/uikit-react-core";

import { AssetEvent, getColumns, makeData } from "../storiesUtils";

export const ListRow = () => {
  const [checkedIdx, setCheckedIdx] = useState(0);

  const columns = useMemo<HvTableColumnConfig<AssetEvent>[]>(() => {
    return [...getColumns(), { Header: "Details", id: "link" }];
  }, []);

  const data = useMemo<AssetEvent[]>(() => makeData(4), []);

  if (!data) return null;

  return (
    <HvTableContainer style={{ padding: 2 }}>
      <HvTable variant="listrow">
        <HvTableHead>
          <HvTableRow>
            <HvTableCell variant="listcheckbox" />
            {columns.map((el) => (
              <HvTableHeader key={String(el.Header)}>
                {el.Header as any}
              </HvTableHeader>
            ))}
          </HvTableRow>
        </HvTableHead>
        <HvTableBody withNavigation>
          {data.map((el, idx) => (
            <HvTableRow key={el.id} hover selected={checkedIdx === idx}>
              <HvTableCell variant="listcheckbox">
                <HvCheckBox
                  aria-label="Tick to select the row"
                  checked={checkedIdx === idx}
                  onClick={() => setCheckedIdx(idx === checkedIdx ? -1 : idx)}
                />
              </HvTableCell>
              <HvTableCell>{el.name}</HvTableCell>
              <HvTableCell>{el.createdDate}</HvTableCell>
              <HvTableCell>{el.eventType}</HvTableCell>
              <HvTableCell>{el.status}</HvTableCell>
              <HvTableCell align="center">{el.riskScore}</HvTableCell>
              <HvTableCell>{el.severity}</HvTableCell>
              <HvTableCell>{el.priority}</HvTableCell>
              <HvTableCell variant="listactions">
                <HvButton
                  variant="secondaryGhost"
                  onClick={() => alert("CLICK!")}
                >
                  View
                </HvButton>
                <HvDropDownMenu
                  keepOpened={false}
                  placement="left"
                  onClick={(e, item) => alert(item.id)}
                  dataList={[
                    { id: "share", label: "Share" },
                    { id: "hide", label: "Hide" },
                    { id: "remove", label: "Remove" },
                  ]}
                />
              </HvTableCell>
            </HvTableRow>
          ))}
        </HvTableBody>
      </HvTable>
    </HvTableContainer>
  );
};
