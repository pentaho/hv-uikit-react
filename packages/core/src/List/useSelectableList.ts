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
import { useMemo, useState } from "react";

import type { HvListValue } from "./types";

export const useSelectableList = (defaultList: HvListValue[] = []) => {
  const [list, setList] = useState(defaultList);

  const selection = useMemo(() => list.filter((elem) => elem.selected), [list]);

  return [list, setList, selection] as const;
};
