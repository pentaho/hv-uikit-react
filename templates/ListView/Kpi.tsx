import { css, cx } from "@emotion/css";
import {
  HvCard,
  HvLoading,
  HvTypography,
  theme,
  type HvCardProps,
  type HvTableInstance,
} from "@hitachivantara/uikit-react-core";
import { BottomXS, TopXS } from "@hitachivantara/uikit-react-icons";

import { getStatusIcon, type ListViewEntry, type TrendData } from "./data";
import { Indicator } from "./Indicator";

const classes = {
  container: css({
    padding: theme.space.sm,
  }),
  card: css({
    cursor: "pointer",
    width: "100%",
    padding: 0,
    textAlign: "left",
  }),
  title: css({
    margin: `${theme.space.xs} 0`,
  }),
  content: css({
    display: "flex",
    alignItems: "center",
  }),
  variation: css({
    display: "flex",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  }),
  selected: css({
    outline: `1px solid ${theme.colors.borderDisabled}`,
  }),
  loading: css({
    margin: `${theme.space.xs} 0`,
  }),
};

interface KpiProps {
  title: string;
  count?: number;
  color: HvCardProps["statusColor"];
  variation?: string;
  status: number;
  instance: HvTableInstance<ListViewEntry, string>;
  kpiSelection: number | undefined;
  setKpiSelection: (value: number | undefined) => void;
  trendData?: TrendData;
  loading?: boolean;
}

export const Kpi = ({
  title,
  count,
  color,
  variation,
  status,
  instance,
  kpiSelection,
  trendData,
  loading,
  setKpiSelection,
}: KpiProps) => {
  const handleKpiClick = () => {
    setKpiSelection(status);
    if (status !== kpiSelection) {
      instance?.setFilter?.("status", `${status}`);
    } else {
      instance?.setFilter?.("status", "");
      setKpiSelection(undefined);
    }
  };

  return (
    <HvCard
      id={`kpi${status}`}
      selectable
      selected={status === kpiSelection}
      bgcolor="bgContainer"
      statusColor={color}
      onClick={handleKpiClick}
      className={cx(classes.card, {
        [classes.selected]: status === kpiSelection,
      })}
      icon={getStatusIcon(status)}
      tabIndex={0}
    >
      <div className={classes.container}>
        <HvTypography variant="label">{title}</HvTypography>
        {loading ? (
          <HvLoading className={classes.loading} small />
        ) : (
          <div className={classes.content}>
            <HvTypography variant="title2" className={classes.title}>
              {count}
            </HvTypography>
            <div className={classes.variation}>
              <Indicator variation={variation} data={trendData} />
              {variation === "up" ? (
                <TopXS title="Up" color="positive" />
              ) : (
                <BottomXS title="Up" color="negative" />
              )}
              <div>
                <HvTypography variant="caption1">vs last 24h.</HvTypography>
              </div>
            </div>
          </div>
        )}
      </div>
    </HvCard>
  );
};
