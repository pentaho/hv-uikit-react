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
import { useNodes } from "reactflow";
import {
  HvEmptyState,
  type HvEmptyStateProps,
} from "@hitachivantara/uikit-react-core";

import { useClasses } from "./Empty.styles";

export interface HvFlowEmptyProps extends HvEmptyStateProps {}

export const HvFlowEmpty = ({ className, ...others }: HvFlowEmptyProps) => {
  const { classes, cx } = useClasses();
  const nodes = useNodes();
  return (
    !nodes ||
    (nodes.length === 0 ? (
      <HvEmptyState className={cx(classes.root, className)} {...others} />
    ) : null)
  );
};
