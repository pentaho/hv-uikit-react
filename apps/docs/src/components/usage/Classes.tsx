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
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import type { HvTableColumnConfig } from "@hitachivantara/uikit-react-core";

import type { ComponentMeta } from "../../utils/component";

type ClassItem = {
  name: string;
  selector: string;
};

const columns: HvTableColumnConfig<ClassItem, string>[] = [
  { Header: "Key", accessor: "name" },
  { Header: "CSS Class", accessor: "selector" },
];

export const Classes = ({ meta }: { meta: ComponentMeta }) => {
  const classesToShow = Object.entries(meta.classes).map(
    ([name, selector]) => ({ name, selector }) as ClassItem,
  );

  return (
    <div className="grid">
      <HvTypography variant="title3">{meta.component} classes</HvTypography>
      <HvTypography className="mt-xs mb-md">
        The following classes are available in the component{" "}
        <code className="nextra-code">classes</code> property.
      </HvTypography>
      <HvTableContainer className="!bg-transparent">
        <HvTable>
          <HvTableHead>
            <HvTableRow className="!bg-transparent">
              {columns.map((el, i) => (
                <HvTableHeader
                  key={el.Header}
                  className={`!bg-transparent ${i === 0 ? "!pl-xs" : ""}`}
                >
                  {el.Header}
                </HvTableHeader>
              ))}
            </HvTableRow>
          </HvTableHead>
          <HvTableBody>
            {classesToShow.map((c) => (
              <HvTableRow
                key={c.name}
                id={`class-${c.name}`}
                className="!bg-transparent"
              >
                <HvTableCell className="w-[25%] !pl-xs">
                  <a
                    href={`#class-${c.name}`}
                    className="[&>span]:hover:visible"
                  >
                    <code>{c.name}</code>
                    <span className="opacity-40 invisible">{` #`}</span>
                  </a>
                </HvTableCell>
                <HvTableCell>
                  <pre className="!text-primaryStrong !text-[12px]">
                    {`.${c.selector}`}
                  </pre>
                </HvTableCell>
              </HvTableRow>
            ))}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
    </div>
  );
};
