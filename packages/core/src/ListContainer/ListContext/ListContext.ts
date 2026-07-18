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
import { createContext } from "react";

const ListContext = createContext<{
  interactive?: boolean;
  nesting?: number;
  condensed?: boolean;
  selectable?: boolean;
  disableGutters?: boolean;
  topContainerRef?: React.MutableRefObject<HTMLUListElement | null>;
}>({});

ListContext.displayName = "ListContext";

export default ListContext;
