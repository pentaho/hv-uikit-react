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
interface CounterLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected: React.ReactNode;
  total: React.ReactNode;
  conjunctionLabel?: React.ReactNode;
}

/** A utility counter component (eg. X / Y) @private */
export const CounterLabel = ({
  selected,
  total,
  conjunctionLabel = "/",
  ...others
}: CounterLabelProps) => {
  return (
    <span {...others}>
      <b>{selected}</b> {` ${conjunctionLabel} ${total}`}
    </span>
  );
};
