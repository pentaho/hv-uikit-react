import { useCallback, useEffect, useRef, useState } from "react";
import type { SortingRule } from "react-table";
import type { HvTableState } from "@hitachivantara/uikit-react-core";

import { makeData, type AssetEvent } from "./storiesUtils";

export { type AssetEvent };

const simpleSortBy = (
  a: Record<string, any>,
  b: Record<string, any>,
  sortBy: SortingRule<string>,
) => {
  const { id, desc } = sortBy;
  return desc ? b[id] - a[id] : a[id] - b[id];
};

const serverData: Data[] = makeData(999).map((x) => ({ ...x, hidden: false }));

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

type FetchDataArgs = Pick<
  HvTableState<AssetEvent>,
  "pageSize" | "pageIndex" | "sortBy"
>;

type ChangeDataArgs =
  | ["add", AssetEvent[]]
  | ["remove", string[]]
  | ["update", AssetEvent]
  | ["restore", string[]];

interface Data extends AssetEvent {
  hidden: boolean;
}

export const useServerData = () => {
  const [allData, setAllData] = useState(serverData);
  const [data, setData] = useState<Data[]>();
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);
  const tableState = useRef<FetchDataArgs>({
    pageSize: 10,
    pageIndex: 0,
    sortBy: [],
  });

  const fetchData = useCallback(
    async ({ pageSize = 10, pageIndex = 0, sortBy = [] }: FetchDataArgs) => {
      tableState.current = { pageSize, pageIndex, sortBy };
      fetchIdRef.current += 1;
      const fetchId = fetchIdRef.current;

      setLoading(true);

      await delay(600);

      if (fetchId !== fetchIdRef.current) return;

      const startRow = pageSize * pageIndex;
      const endRow = startRow + pageSize;

      const visibleData = allData.filter((x) => !x.hidden);
      const newData = visibleData
        .toSorted(
          sortBy[0] ? (a, b) => simpleSortBy(a, b, sortBy[0]) : undefined,
        )
        .slice(startRow, endRow);
      setData(newData);

      // Static example . Set server-side page count here
      setPageCount(Math.ceil(visibleData.length / pageSize));

      setLoading(false);
    },
    [allData],
  );

  const mutateData = useCallback(async (...args: ChangeDataArgs) => {
    const [method, params] = args;

    await delay(600);

    if (method === "add") {
      setAllData((prev) => [
        ...params.map((el) => ({ ...el, hidden: false })),
        ...prev,
      ]);
    } else if (method === "remove") {
      setAllData((prev) =>
        prev.map((el) => ({
          ...el,
          hidden: params.includes(el.id) ? true : el.hidden,
        })),
      );
    } else if (method === "update") {
      setAllData((prev) =>
        prev.map((el) => (params.id === el.id ? { ...el, ...params } : el)),
      );
    } else if (method === "restore") {
      setAllData((prev) =>
        prev.map((el) => ({
          ...el,
          hidden: params.includes(el.id) ? false : el.hidden,
        })),
      );
    }
  }, []);

  useEffect(() => {
    fetchData(tableState.current);
  }, [fetchData]);

  return {
    data,
    fetchData,
    mutateData,
    loading,
    pageCount,
    totalRecords: allData.filter((x) => !x.hidden).length,
  } as const;
};
