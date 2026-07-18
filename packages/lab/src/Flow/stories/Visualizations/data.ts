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
export const data = [
  { country: "portugal", year: "2020", population: 10030000 },
  { country: "portugal", year: "2021", population: 10030000 },
  { country: "portugal", year: "2022", population: 10030000 },
  { country: "portugal", year: "2023", population: 10020000 },
  { country: "usa", year: "2020", population: 336000000 },
  { country: "usa", year: "2021", population: 337000000 },
  { country: "usa", year: "2022", population: 338000000 },
  { country: "usa", year: "2023", population: 340000000 },
  { country: "japan", year: "2020", population: 126000000 },
  { country: "japan", year: "2021", population: 125000000 },
  { country: "japan", year: "2022", population: 125000000 },
  { country: "japan", year: "2023", population: 124000000 },
];

export interface NodeData {
  checked?: string[];
  jsonData?: typeof data;
}
