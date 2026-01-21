import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

// --- Types ---

type DataObject = Record<string, string | number | undefined>;

export interface ServerPaginationProps<T extends DataObject = DataObject> {
  endpoint: string;
  db: T[];
  limit: number;
  skip: number;
  sort?: string;
  order?: "desc" | "asc";
  filter?: { id: string; value: string | number };
  search?: string;
}

export interface PaginationData<T extends DataObject = DataObject> {
  data: T[];
  total: number;
  pages: number;
}

// --- Utils ---

export const delay = (ms = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve("Time passed"), ms);
  });

const searchObj = (entry: DataObject, search: string) => {
  return Object.keys(entry)
    .filter((key) => key !== "id" && key !== "statusColor")
    .find(
      (key) =>
        entry[key]?.toString().toLowerCase().search(search.toLowerCase()) !==
        -1,
    )?.length;
};

// --- Pagination hook ---

export function useServerPagination<T extends DataObject = DataObject>({
  endpoint,
  db,
  limit,
  skip,
  sort,
  order = "desc",
  filter,
  search,
}: ServerPaginationProps<T>) {
  const initialState: PaginationData<T> = {
    data: [],
    pages: 0,
    total: 0,
  };
  const [currData, setCurrData] = useState(initialState);
  const [deleting, setDeleting] = useState(false);
  const [allData, setAllData] = useState<T[]>(db);

  const fetcher = useCallback(async () => {
    // Loading
    await delay(800);

    const items =
      search || filter
        ? allData.filter((entry) => {
            let keep = true;

            if (search) {
              keep = !!searchObj(entry, search);
            }
            if (filter && keep) {
              keep =
                entry[filter.id]?.toString().toLowerCase() ===
                filter.value.toString().toLowerCase();
            }

            return keep;
          })
        : [...allData];

    return {
      data: items
        .toSorted(
          sort
            ? (a, b) => {
                return order === "desc"
                  ? (b[sort] || "")
                      .toString()
                      .localeCompare((a[sort] || "").toString(), undefined, {
                        numeric: true,
                        sensitivity: "base",
                      })
                  : (a[sort] || "")
                      .toString()
                      .localeCompare((b[sort] || "").toString(), undefined, {
                        numeric: true,
                        sensitivity: "base",
                      });
              }
            : undefined,
        )
        .slice(skip, skip + limit),
      total: items.length,
      pages: Math.ceil(items.length / limit),
    };
  }, [allData, filter, limit, order, search, skip, sort]);

  const { data, isLoading, mutate } = useSWR<PaginationData<T>>(() => {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      ...(sort && { sort, order }),
      ...(search && { search }),
      ...(filter && { [filter.id]: filter.value }),
    });

    return `${endpoint}?${params.toString()}`;
  }, fetcher);

  // Prevents data from updating to undefined when loading (this crashes useHvData)
  useEffect(() => {
    if (!isLoading && data) {
      setCurrData(data);
    }
  }, [isLoading, data]);

  const deleteEntries = useCallback(
    async (ids: string[]) => {
      setDeleting(true);

      setAllData((prev) =>
        prev.filter((entry: any) => entry.id && !ids.includes(entry.id)),
      );

      const refreshedData = await fetcher();

      mutate(refreshedData);

      await delay(800);

      setDeleting(false);
    },
    [fetcher, mutate],
  );

  return {
    deleteEntries,
    data: currData,
    loading: isLoading || deleting,
  };
}
