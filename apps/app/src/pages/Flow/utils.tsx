import { loadArrow } from "arquero";
import useSWR from "swr";

import { LAYOUT_COLS, type DashboardSpecs } from "./types";

export const datasets = [
  {
    id: "steelwheels1",
    url: "https://pentaho.github.io/assets/steelwheels.arrow",
    label: "Steelwheels 1",
  },
  {
    id: "steelwheels2",
    url: "https://pentaho.github.io/assets/steelwheels.arrow",
    label: "Steelwheels 2",
  },
];

const fetchDatasets = async () => {
  const promises = datasets.map(async (dataset) => {
    // @ts-ignore
    return loadArrow(dataset.url);
  });

  const tables = await Promise.all(promises);

  return tables.map((table, idx) => {
    const { id, label, url } = datasets[idx];

    return {
      id,
      url,
      label,
      columns: table.columnNames(),
    };
  });
};

export const useDatasets = () => {
  return useSWR("/datasets", fetchDatasets, { suspense: true });
};

export const buildLayout = (
  items: DashboardSpecs["items"],
  layout?: DashboardSpecs["layout"],
) => {
  return items.map((node, idx) => {
    const item = layout?.find((x) => x.i === node.id);

    if (item) {
      return item;
    }

    const w = 4;
    const h = 3;
    const perRow = LAYOUT_COLS / w;

    const maxY = layout ? Math.max(...layout.map((x) => x.y)) : undefined;
    const maxX =
      maxY != null && layout
        ? Math.max(...layout.filter((x) => x.y === maxY).map((x) => x.x))
        : undefined;
    const lastItem = layout?.find((x) => x.x === maxX && x.y === maxY);
    const newLine = lastItem
      ? LAYOUT_COLS - (lastItem.x + lastItem.w) < w
      : undefined;

    return {
      i: node.id,
      w,
      h: node.type === "kpi" ? 1 : h,
      x:
        newLine != null && lastItem
          ? newLine
            ? 0
            : lastItem.x + lastItem.w
          : (idx * w) % LAYOUT_COLS,
      y:
        newLine != null && lastItem
          ? newLine
            ? lastItem.y + h
            : lastItem.y
          : Math.floor(idx / perRow) * h,
    };
  });
};

export const toTitleCase = (string = "") => {
  return string
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim()
    .toLowerCase()
    .replace(/\b(\w)/g, (s) => s.toUpperCase());
};
