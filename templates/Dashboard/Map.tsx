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
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  type MapContainerProps,
  type MarkerProps,
  type PopupProps,
} from "react-leaflet";
import { css, cx } from "@emotion/css";
import { Global } from "@emotion/react";
import { Icon } from "leaflet";

import { mapStyles } from "./Map.styles";

const IconDefault = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
});

const LevelIcons = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" fill="#478B1A"><path d="M3.37 11.4a6 6 0 1 1 5.26 0L6 16Zm0 0" /><path fill="#f0f0f0" d="M5.02 8.98 3.15 7.1l.7-.7 1.13 1.12 3.14-3.6.76.66Zm0 0"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" fill="#4D8AC0"><path d="M3.71 12H0l1.71-6L0 0h12l-1.71 6L12 12H8.29L6 16Zm0 0"/><path fill="#f0f0f0" d="M5.02 8.98 3.15 7.1l.7-.7 1.13 1.12 3.14-3.6.76.66Zm0 0"/></svg>`,
  ``, // NO LEVEL 2
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 16" fill="#F9C846"><path d="M3.37 11.4a6 6 0 1 1 5.26 0L6 16Zm0 0"/><path fill="#f0f0f0" d="M5.54 8h1v1h-1ZM5.5 3h1v4h-1Zm0 0"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#D43136"><path d="M5.36 11.4a6 6 0 1 1 5.27 0L8 16Zm0 0"/><path fill="#f0f0f0" d="M6.53 8h1v1h-1ZM6.5 3h1v4h-1Zm2.03 5h1v1h-1ZM8.5 3h1v4h-1Zm0 0"/></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 15" fill="#930A80"><path d="M3.75 11.19A5.76 5.76 0 0 1 .11 4.7C.66 1.98 3.13 0 6 0s5.34 1.98 5.88 4.7a5.77 5.77 0 0 1-3.64 6.49L6 14.99Zm0 0"/><path fill="#f0f0f0" d="M6.54 7.74v.97h-1v-.97ZM5.5 2.91h1v3.86h-1Zm3.04 4.83v.97h-1v-.97ZM7.5 2.91h1v3.86h-1ZM4.55 7.74v.97h-1v-.97ZM3.5 2.91h1v3.86h-1Zm0 0"/></svg>`,
].map((svg) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
    iconSize: [32, 32],
  });
});

interface MapProps extends MapContainerProps {
  children?: React.ReactNode;
  markers?: {
    position: MarkerProps["position"];
    label: PopupProps["children"];
    level?: 0 | 1 | 3 | 4 | 5;
  }[];
}

export const Map = ({ markers, ...props }: MapProps) => {
  return (
    <>
      <Global styles={mapStyles} />
      <MapContainer
        className={cx(
          css({
            ".leaflet-tile-container img": {
              filter: "grayscale(100%)",
            },
          }),
        )}
        {...props}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers?.map(({ label, position, level = -1 }) => (
          <Marker
            key={String(position)}
            icon={LevelIcons[level] || IconDefault}
            position={position}
          >
            <Popup>{label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};
