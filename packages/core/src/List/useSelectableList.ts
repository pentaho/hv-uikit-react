import { useMemo, useState } from "react";

import type { HvListValue } from "./types";

export const useSelectableList = (defaultList: HvListValue[] = []) => {
  const [list, setList] = useState(defaultList);

  const selection = useMemo(() => list.filter((elem) => elem.selected), [list]);

  return [list, setList, selection] as const;
};
