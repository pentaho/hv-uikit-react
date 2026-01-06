import { useMemo } from "react";

import { HvOverflowTooltip } from "../../OverflowTooltip";

export interface HvDateColumnCellProp {
  /** Date to render. */
  date?: string;
}

const formatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "short",
  timeStyle: "medium",
});

export const HvDateColumnCell = ({ date }: HvDateColumnCellProp) => {
  const formattedDate = useMemo(() => {
    return date ? formatter.format(new Date(date)) : "—";
  }, [date]);

  return <HvOverflowTooltip data={formattedDate} />;
};
