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
import type { HvColor } from "@hitachivantara/uikit-react-core";

export type Column = {
  id: string;
  title: string;
  color?: HvColor;
  icon?: React.ReactNode;
};

export type User = {
  name: string;
  avatar: string;
};

export type Task = {
  id: string;
  columnId: Column["id"];
  title: string;
  users?: User[];
  statusLevel?: number;
};
