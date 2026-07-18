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
import { useState } from "react";
import {
  HvBaseDropdown,
  HvIconButton,
  HvLabel,
  HvPanel,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

type Asset = { id: string; label: string };
type Site = { id: string; label: string; assets: Asset[] };
type Region = { id: string; label: string; sites: Site[] };

const regions: Region[] = [
  {
    id: "emea",
    label: "EMEA",
    sites: [
      {
        id: "lisbon",
        label: "Lisbon Plant",
        assets: [
          { id: "comp-a", label: "Compressor A" },
          { id: "pump-b", label: "Pump B" },
          { id: "valve-c", label: "Valve C" },
        ],
      },
      {
        id: "berlin",
        label: "Berlin Site",
        assets: [
          { id: "motor-1", label: "Motor 1" },
          { id: "turbine-2", label: "Turbine 2" },
        ],
      },
    ],
  },
  {
    id: "amer",
    label: "AMER",
    sites: [
      {
        id: "houston",
        label: "Houston Facility",
        assets: [
          { id: "drill-01", label: "Drill Unit 01" },
          { id: "pump-02", label: "Pump 02" },
          { id: "sensor-03", label: "Sensor Array 03" },
        ],
      },
      {
        id: "toronto",
        label: "Toronto Office",
        assets: [
          { id: "hvac-1", label: "HVAC Unit 1" },
          { id: "ups-1", label: "UPS System" },
        ],
      },
    ],
  },
  {
    id: "apac",
    label: "APAC",
    sites: [
      {
        id: "singapore",
        label: "Singapore Hub",
        assets: [
          { id: "chiller-a", label: "Chiller A" },
          { id: "gen-b", label: "Generator B" },
        ],
      },
    ],
  },
];

type Level = "region" | "site" | "asset";

interface Selection {
  region: Region | null;
  site: Site | null;
  asset: Asset | null;
}

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<Level>("region");
  const [selection, setSelection] = useState<Selection>({
    region: null,
    site: null,
    asset: null,
  });

  const handleToggle = (_: unknown, isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // re-open at the deepest confirmed level
      if (selection.asset) setLevel("asset");
      else if (selection.site) setLevel("site");
      else setLevel("region");
    }
  };

  const selectRegion = (region: Region) => {
    setSelection({ region, site: null, asset: null });
    setLevel("site");
  };

  const selectSite = (site: Site) => {
    setSelection((prev) => ({ ...prev, site, asset: null }));
    setLevel("asset");
  };

  const selectAsset = (asset: Asset) => {
    setSelection((prev) => ({ ...prev, asset }));
    setOpen(false);
  };

  const placeholderText = selection.asset
    ? `${selection.region!.label} / ${selection.site!.label} / ${selection.asset.label}`
    : selection.site
      ? `${selection.region!.label} / ${selection.site!.label}`
      : selection.region
        ? selection.region.label
        : "Select asset location...";

  const listItems: { id: string; label: string }[] =
    level === "region"
      ? regions
      : level === "site"
        ? (selection.region?.sites ?? [])
        : (selection.site?.assets ?? []);

  const onSelect = (item: { id: string; label: string }) => {
    if (level === "region")
      selectRegion(regions.find((r) => r.id === item.id)!);
    else if (level === "site")
      selectSite(selection.region!.sites.find((s) => s.id === item.id)!);
    else selectAsset(item);
  };

  const levelLabel: Record<Level, string> = {
    region: "Region",
    site: `${selection.region?.label ?? ""} › Site`,
    asset: `${selection.site?.label ?? ""} › Asset`,
  };

  const canGoBack = level !== "region";

  const goBack = () => {
    if (level === "asset") setLevel("site");
    else if (level === "site") setLevel("region");
  };

  return (
    <div className="w-320px">
      <HvLabel label="Asset location" showGutter />
      <HvBaseDropdown
        expanded={open}
        onToggle={handleToggle}
        placeholder={
          <div className="flex items-center gap-xs overflow-hidden">
            <div className="i-ph-map-pin-simple text-16px color-textSubtle shrink-0" />
            <HvTypography noWrap className="flex-1">
              {placeholderText}
            </HvTypography>
          </div>
        }
      >
        <HvPanel className="w-320px flex flex-col">
          <div className="flex items-center gap-xs px-xs pt-xs pb-xxs border-b-1 border-borderSubtle">
            {canGoBack && (
              <HvIconButton title="Back" size="xs" onClick={goBack}>
                <div className="i-ph-arrow-left" />
              </HvIconButton>
            )}
            <HvTypography variant="label" className="color-textSubtle">
              {levelLabel[level]}
            </HvTypography>
          </div>

          <div className="flex flex-col py-xxs">
            {listItems.map((item) => {
              const isSelected =
                (level === "region" && selection.region?.id === item.id) ||
                (level === "site" && selection.site?.id === item.id) ||
                (level === "asset" && selection.asset?.id === item.id);
              const hasChildren = level !== "asset";

              return (
                <button
                  type="button"
                  key={item.id}
                  className={`flex items-center justify-between px-sm py-xs hover:bg-bgHover w-full text-left ${isSelected ? "color-primary" : ""}`}
                  onClick={() => onSelect(item)}
                >
                  <HvTypography variant={isSelected ? "label" : "body"}>
                    {item.label}
                  </HvTypography>
                  {hasChildren && (
                    <div className="i-ph-caret-right text-14px color-textSubtle" />
                  )}
                </button>
              );
            })}
          </div>
        </HvPanel>
      </HvBaseDropdown>
    </div>
  );
}
