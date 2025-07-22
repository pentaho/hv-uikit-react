import { css } from "@emotion/css";
import {
  HvAvatar,
  HvGrid,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Bottom, Top } from "@hitachivantara/uikit-react-icons";

import { useModelData } from "./data";
import { MetadataItem } from "./MetadataItem";

const Kpi = ({
  title,
  count,
  diff,
}: {
  title: string;
  count: number;
  diff: number;
}) => {
  const Icon = diff > 0 ? Top : Bottom;

  return (
    <MetadataItem title={title}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <HvTypography variant="title2">{count}</HvTypography>
        <Icon color={theme.colors[diff > 0 ? "positive" : "warning"]} />
        <HvTypography variant="caption1">
          {`${Math.abs(diff).toFixed(2)} ${diff > 0 ? "more" : "less"}`}
        </HvTypography>
      </div>
    </MetadataItem>
  );
};

export const KPIs = () => {
  const { data } = useModelData();
  const { deploys, imageUrl } = data;

  return (
    <>
      <HvGrid item xs={12} md={2} lg={2}>
        <HvAvatar
          size="xl"
          status="border"
          classes={{ container: css({ margin: "auto", width: "fit-content" }) }}
          src={imageUrl}
          alt="Asset image"
        />
      </HvGrid>
      <HvGrid item xs={12} md={10} lg={10}>
        <HvGrid container direction="row">
          {deploys.summary.map((el) => (
            <HvGrid key={el.id} item xs={12} sm={4}>
              <Kpi title={el.title} count={el.count} diff={el.diff} />
            </HvGrid>
          ))}
          {deploys.data.map((el) => (
            <HvGrid key={el.id} item xs={12} sm={4}>
              <MetadataItem title={el.title}>
                <HvTypography variant="caption1">{el.value}</HvTypography>
              </MetadataItem>
            </HvGrid>
          ))}
        </HvGrid>
      </HvGrid>
    </>
  );
};
