/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import {
  HvEmptyState,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

import { getColumns } from "../storiesUtils";

export const NoData = () => (
  <HvTableContainer>
    <HvTable>
      <HvTableHead>
        <HvTableRow>
          {getColumns().map((el) => (
            <HvTableHeader key={String(el.Header)}>
              {el.Header as any}
            </HvTableHeader>
          ))}
        </HvTableRow>
      </HvTableHead>
      <HvTableBody>
        <HvTableRow>
          <HvTableCell colSpan={100} style={{ height: 96 }}>
            <HvEmptyState message="No data to display." icon={<Ban />} />
          </HvTableCell>
        </HvTableRow>
      </HvTableBody>
    </HvTable>
  </HvTableContainer>
);
