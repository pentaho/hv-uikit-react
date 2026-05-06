import { loadArrow } from "arquero";
import useSWR from "swr";
import {
  HvBarChart,
  HvDonutChart,
  HvLineChart,
} from "@hitachivantara/uikit-react-viz";

import type { NodeData } from "../../types";
import { datasets } from "../../utils";
import { ChartContainer } from "./ChartContainer";
import { Kpi } from "./Kpi";
import { Table } from "./Table";

const useData = (endpointId?: string) => {
  const url = datasets.find((ds) => ds.id === endpointId)?.url || null;

  // @ts-ignore
  return useSWR(url, loadArrow);
};

export interface RendererProps<T extends string = string> {
  id: string;
  type: T;
  data: NodeData;
}

export const Renderer = (props: RendererProps) => {
  const { type, data: nodeData } = props;
  const {
    endpoint,
    measure,
    groupBy,
    splitBy,
    aggregation,
    unit,
    title = "",
  } = nodeData;
  const { data, isLoading } = useData(endpoint);

  if (type === "lineChart") {
    return (
      <ChartContainer title={title} loading={isLoading}>
        {measure && groupBy && data && (
          <HvLineChart
            data={data}
            measures={measure}
            groupBy={groupBy}
            splitBy={splitBy}
          />
        )}
      </ChartContainer>
    );
  }

  if (type === "barChart") {
    return (
      <ChartContainer title={title} loading={isLoading}>
        {measure && groupBy && data && (
          <HvBarChart
            data={data}
            measures={measure}
            groupBy={groupBy}
            splitBy={splitBy}
          />
        )}
      </ChartContainer>
    );
  }

  if (type === "donutChart") {
    return (
      <ChartContainer title={title} loading={isLoading}>
        {measure && groupBy && data && (
          <HvDonutChart
            data={data}
            measure={measure as string}
            groupBy={groupBy}
          />
        )}
      </ChartContainer>
    );
  }

  if (type === "kpi") {
    return (
      <Kpi
        loading={isLoading}
        title={title}
        measure={measure as string}
        data={data}
        unit={unit}
        aggregation={aggregation}
      />
    );
  }

  if (type === "table") {
    return (
      <Table
        loading={isLoading}
        title={title}
        data={data}
        measure={measure as string}
      />
    );
  }

  return null;
};
