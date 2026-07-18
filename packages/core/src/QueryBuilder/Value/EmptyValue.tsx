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
import { useEffect } from "react";

import { useQueryBuilderContext } from "../Context";

export interface EmptyValueProps {
  id: React.Key;
}

export const EmptyValue = ({ id }: EmptyValueProps) => {
  const { dispatchAction } = useQueryBuilderContext();

  // Clear value on first render
  useEffect(() => {
    dispatchAction({
      type: "set-value",
      id,
      value: null,
    });
  }, [dispatchAction, id]);

  return null;
};
