import { Suspense, useState, useTransition } from "react";
import { css } from "@emotion/css";
import { useDebounce } from "usehooks-ts";
import {
  HvButton,
  HvGrid,
  HvLoading,
  HvMultiButton,
  HvTypography,
  theme,
  type HvMultiButtonProps,
} from "@hitachivantara/uikit-react-core";
import { Add, User } from "@hitachivantara/uikit-react-icons";
import {
  HvBarChart,
  HvDonutChart,
  HvLineChart,
  HvVizProvider,
} from "@hitachivantara/uikit-react-viz";

import { useServerData } from "./data";
import { GridPanel } from "./GridPanel";
import { Kpi } from "./Kpi";
import { Map as MapComponent } from "./Map";

interface ButtonsProps extends HvMultiButtonProps {
  labels: string[];
  onButtonChange?: (index: number) => void;
}

const formatter = (value?: number | string) => `${Number(value) / 1000}k`;

const Buttons = ({ labels, onButtonChange, ...others }: ButtonsProps) => {
  const [selected, setSelected] = useState(0);

  const handleClick = (index: number) => {
    if (index === selected) return;
    setSelected(index);
    onButtonChange?.(index);
  };

  return (
    <HvMultiButton {...others}>
      {labels.map((label, index) => (
        <HvButton
          key={label}
          style={{ width: 90 }}
          selected={selected === index}
          onClick={() => handleClick(index)}
        >
          {label}
        </HvButton>
      ))}
    </HvMultiButton>
  );
};

const Dashboard = () => {
  const [time, setTime] = useState(0);
  const [isPending, startTransition] = useTransition();
  const isLoading = useDebounce(isPending, 50);
  const { data } = useServerData(time);

  return (
    <HvGrid container>
      <HvGrid item xs={12} display="flex" justifyContent="space-between">
        <HvTypography component="h1" variant="title3">
          Dashboard
        </HvTypography>
        <div className={css({ display: "flex", gap: theme.space.xs })}>
          <Buttons
            labels={["Today", "Week", "Month"]}
            onButtonChange={(index) => {
              startTransition(() => {
                setTime(index);
              });
            }}
          />
          <HvButton variant="secondaryGhost" startIcon={<Add />}>
            Add Portlet
          </HvButton>
        </div>
      </HvGrid>
      <GridPanel xs={12} md={8} isLoading={isLoading}>
        <HvBarChart
          horizontal
          stack="Group"
          data={data.barData}
          measures={[
            "Sales Target",
            "Sales Per Rep",
            "Monthly Sales",
            "Target",
          ]}
          groupBy="Group"
        />
      </GridPanel>
      <GridPanel xs={12} md={4} isLoading={isLoading}>
        <div className={css({ position: "relative", height: "100%" })}>
          <HvDonutChart
            data={data.donutData}
            groupBy="Category"
            measure={{ field: "Total", valueFormatter: (v) => `${v} €` }}
          />
          <div
            className={css({
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexFlow: "column wrap",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            <User iconSize="M" />
            <HvTypography variant="title3">
              {data.donutData.Total.reduce((acc, value) => acc + value, 0)}
            </HvTypography>
          </div>
        </div>
      </GridPanel>
      {[1, 2, 3, 4].map((key) => (
        <HvGrid key={key} item xs={6} md={3}>
          <Kpi color="positive" title="KPI description" value={3340} />
        </HvGrid>
      ))}
      <GridPanel xs={12} isLoading={isLoading}>
        <HvLineChart
          area
          stack="total"
          data={data.lineData}
          groupBy="Group"
          measures={Object.keys(data.lineData).slice(1)}
          yAxis={{ labelFormatter: formatter }}
          tooltip={{ valueFormatter: formatter }}
        />
      </GridPanel>
      <GridPanel xs={12} md={6} width="100%" height={400} isLoading={isLoading}>
        <MapComponent
          center={[38.7356, -9.2997]}
          zoom={18}
          style={{ height: "100%" }}
          markers={[
            { position: [38.7356, -9.2997], label: "HV Office", level: 0 },
            { position: [38.735, -9.299], label: "Bus Stop", level: 3 },
            { position: [38.735, -9.2993], label: "Fire", level: 4 },
          ]}
        />
      </GridPanel>
      <GridPanel xs={12} md={6} height={400} isLoading={isLoading}>
        <HvBarChart
          height={400}
          data={data.barData2}
          groupBy="Group"
          measures={Object.keys(data.barData2).slice(1)}
          stack="total"
        />
      </GridPanel>
    </HvGrid>
  );
};

export const Component = () => (
  <HvVizProvider>
    <Suspense fallback={<HvLoading style={{ minHeight: 400 }} />}>
      <Dashboard />
    </Suspense>
  </HvVizProvider>
);

export default Component;
