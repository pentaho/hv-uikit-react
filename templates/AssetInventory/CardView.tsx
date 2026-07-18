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
import {
  HvActionBar,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvCardMedia,
  HvCheckBox,
  HvSimpleGrid,
  HvSkeleton,
  HvTypography,
  type HvTableInstance,
} from "@hitachivantara/uikit-react-core";

import { getStatusIcon, type AssetInventoryEntry } from "./data";

interface CardViewProps {
  id?: string;
  instance: HvTableInstance<AssetInventoryEntry, string>;
  loading?: boolean;
}

export const CardView = ({ id, instance, loading }: CardViewProps) => {
  const selectedCardsIds = instance.selectedFlatRows.map((r) => r.id);
  const mode = "wave";

  const items = loading
    ? Array.from({ length: 6 }).map((_, i) => ({
        id: String(i),
        name: "",
        eventType: "",
        severity: "",
        status: "",
        priority: "",
        image: "",
        statusColor: "",
      }))
    : instance.page.map((p) => ({ ...p.original, id: p.id }));

  return (
    <HvSimpleGrid
      id={id}
      breakpoints={[
        { minWidth: 1919, cols: 4, spacing: "md" },
        { minWidth: 960, cols: 3, spacing: "md" },
        { minWidth: 600, cols: 2, spacing: "sm" },
        { minWidth: 0, cols: 1, spacing: "sm" },
      ]}
    >
      {items.map((item) => {
        const rowId = item?.id;
        const statusColor = item?.statusColor;

        return (
          <HvCard
            selectable
            selected={rowId ? selectedCardsIds.includes(rowId) : undefined}
            bgcolor="bgContainer"
            key={item.id}
            style={{ width: "100%" }}
            statusColor={statusColor}
            icon={
              !loading ? (
                getStatusIcon(statusColor)
              ) : (
                <HvSkeleton
                  hidden={!loading}
                  variant="circle"
                  animation="wave"
                  width={32}
                  height={32}
                />
              )
            }
          >
            <HvCardHeader
              title={
                loading ? (
                  <HvSkeleton animation="wave" width="50%" />
                ) : (
                  item.name
                )
              }
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div>
                <HvCardContent>
                  <HvTypography variant="label">Event</HvTypography>
                  <HvTypography noWrap component="div">
                    <HvSkeleton hidden={!loading} animation={mode}>
                      {item.eventType}
                    </HvSkeleton>
                  </HvTypography>
                </HvCardContent>
                <HvCardContent>
                  <HvTypography variant="label">Severity</HvTypography>
                  <HvTypography noWrap component="div">
                    <HvSkeleton hidden={!loading} animation={mode}>
                      {item.severity}
                    </HvSkeleton>
                  </HvTypography>
                </HvCardContent>
              </div>
              <div>
                <HvCardContent>
                  <HvTypography variant="label">Status</HvTypography>
                  <HvTypography noWrap component="div">
                    <HvSkeleton hidden={!loading} animation={mode}>
                      {item.status}{" "}
                    </HvSkeleton>
                  </HvTypography>
                </HvCardContent>
                <HvCardContent>
                  <HvTypography variant="label">Priority</HvTypography>
                  <HvTypography noWrap component="div">
                    <HvSkeleton hidden={!loading} animation={mode}>
                      {item.priority}{" "}
                    </HvSkeleton>
                  </HvTypography>
                </HvCardContent>
              </div>
            </div>
            <HvSkeleton
              hidden={!loading}
              width="auto"
              variant="square"
              animation={mode}
              backgroundImage="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png"
            >
              <HvCardMedia
                component="img"
                alt={item.name}
                height={140}
                image={item.image}
              />
            </HvSkeleton>
            <HvActionBar>
              <HvSkeleton hidden={!loading} variant="square" animation={mode}>
                <HvCheckBox
                  onChange={
                    rowId
                      ? () => instance.toggleRowSelected?.(rowId)
                      : undefined
                  }
                  checked={instance.selectedFlatRows.some(
                    (r) => r.id === rowId,
                  )}
                  value="value"
                  inputProps={{ "aria-label": "Tick to select the card" }}
                />
              </HvSkeleton>
              <div aria-hidden style={{ flex: 1 }} />
              <HvSkeleton hidden={!loading} variant="square" animation={mode}>
                <HvButton variant="secondaryGhost">View</HvButton>
              </HvSkeleton>
            </HvActionBar>
          </HvCard>
        );
      })}
    </HvSimpleGrid>
  );
};
