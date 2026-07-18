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
import { theme } from "@hitachivantara/uikit-react-core";

export interface CatServerProps extends React.ComponentProps<"svg"> {
  title?: string;
}

const mugSpillColor = "#ffa82f";

export default function CatServer({
  title = "Black cat spilling drink on server rack",
  ...others
}: CatServerProps) {
  return (
    <svg viewBox="0 0 831.85 484.67" role="img" aria-label={title} {...others}>
      <path
        fill="#fff"
        d="M400.97 77.51C607 77.51 774 244.52 774 450.54H27.94c0-206.02 167.01-373.03 373.03-373.03"
        opacity={0.7}
      />
      <g>
        <g fill={mugSpillColor} transform="translate(-555.03 -336.33)">
          <ellipse
            cx={62}
            cy={9}
            rx={62}
            ry={9}
            transform="translate(898 797)"
          />
          <ellipse
            cx={12}
            cy={2.5}
            rx={12}
            ry={2.5}
            transform="translate(1013 812)"
          />
          <ellipse
            cx={4.5}
            cy={2}
            rx={4.5}
            ry={2}
            transform="translate(1006 817)"
          />
        </g>
        <g transform="translate(-559.03 -336.33)">
          <rect
            width={180}
            height={202}
            fill="#ccced0"
            rx={3}
            transform="translate(871 565)"
          />
          <g>
            <rect
              width={207}
              height={70}
              fill="#e8e8e8"
              rx={3}
              transform="translate(857 732)"
            />
            <path
              fill="none"
              stroke="#ccced0"
              strokeLinecap="round"
              strokeWidth={3}
              d="M1034 787.5v-41"
            />
            <path
              fill="none"
              stroke="#ccced0"
              strokeLinecap="round"
              strokeWidth={3}
              d="M1014 787.5v-41"
            />
            <path
              fill="none"
              stroke="#ccced0"
              strokeLinecap="round"
              strokeWidth={3}
              d="M1044 787.5v-41"
            />
            <path
              fill="none"
              stroke="#ccced0"
              strokeLinecap="round"
              strokeWidth={3}
              d="M1024 787.5v-41"
            />
            <g transform="translate(-8053 -1069)">
              <rect
                width={40}
                height={40}
                fill="#999"
                rx={6}
                transform="translate(8925 1816)"
              />
              <circle
                cx={16}
                cy={16}
                r={16}
                fill="#fff"
                transform="translate(8929 1820)"
              />
              <circle
                cx={3}
                cy={3}
                r={3}
                fill="#ccced0"
                transform="translate(8942 1833)"
              />
              <path fill="#e8e8e8" d="M8959.4 1836a4.7 4.7 0 0 1-9.4 0Z" />
              <path fill="#e8e8e8" d="M8930.6 1836a4.7 4.7 0 0 1 9.4 0Z" />
              <path fill="#e8e8e8" d="M8945 1821.6a4.7 4.7 0 0 1 0 9.4Z" />
              <path fill="#e8e8e8" d="M8945 1850.4a4.7 4.7 0 0 1 0-9.4Z" />
            </g>
          </g>
          <g>
            <rect
              width={207}
              height={62}
              fill="#e8e8e8"
              rx={3}
              transform="translate(857 660)"
            />
            <path fill="#fbfcfc" d="M857 687h207v8H857z" />
          </g>
          <g transform="translate(-8053 -1009)">
            <rect
              width={207}
              height={50}
              fill="#e8e8e8"
              rx={3}
              transform="translate(8910 1609)"
            />
            <g>
              <path
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth={2}
                d="M8930 1629h41"
              />
              <path
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth={2}
                d="M8930 1639h41"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#fff"
                transform="translate(9055 1629)"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#ccced0"
                transform="translate(9070 1629)"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#fff"
                transform="translate(9085 1629)"
              />
            </g>
          </g>
          <g transform="translate(-8053 -1069)">
            <rect
              width={207}
              height={50}
              fill="#e8e8e8"
              rx={3}
              transform="translate(8910 1609)"
            />
            <g>
              <path
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth={2}
                d="M8930 1629h41"
              />
              <path
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth={2}
                d="M8930 1639h41"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#fff"
                transform="translate(9055 1629)"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#ccced0"
                transform="translate(9070 1629)"
              />
              <circle
                cx={5}
                cy={5}
                r={5}
                fill="#fff"
                transform="translate(9085 1629)"
              />
            </g>
          </g>
        </g>
        <g>
          <path
            fill={theme.colors.textDark}
            d="M337.87 69.6a37 37 0 0 1 13.03 12c7.41-2.2 12.42-.8 15.81 0 5.94-6.13 10.96-10.84 14.9-12 3.46 4.4 6.6 19.44 6.28 31.15s-5.56 17.43-10.18 19.29c-.62 8.87 3.58 26.18 7.52 32.12a54 54 0 0 0 11.9 12.88c4.4 3.63 4.73 9.43 2.45 12.35s-7 3.3-10.6 1.86c-1.23-3.19 0-4.46 0-4.46s-10.77-2.82-14-7.07c-1.17 1.22.26 2.02 2.48 11.02s-3.81 16.76-3.81 16.76 4.9 2.72 4.25 5.77-2.19 2.49-6.54 2.65c-1.74.06-7.98-.1-9.79 0-1.92.1.56.46-2.75.71-5.53.43-10.11-1.03-12.15-.99-6.12-.02-5.03.06-12.16 0s-13.1.25-18.68-.87-12.32-3.83-20.74 0-5.2 10.7-1.9 11.92 4.56 4.73 1.9 6.97-8.77 2.04-12.49-1.9-8.19-11.79 0-21.82 25.08-8.19 30.12-7.13c-3.48-6.83-8.63-17.35 0-33.99s19.73-25.7 23.37-30a28 28 0 0 0 4.92-7.93s-9.55-6.78-9.93-18.14 3.22-27.78 6.8-31.14"
          />
          <path
            fill="#696969"
            d="M354.32 107.93a4.83 4.83 0 0 1 8.31 0s-2.52.11-3.05 1.53-.5 1.59-1.08 1.59-.39-.2-1.12-1.59-3.06-1.53-3.06-1.53"
          />
          <g>
            <path fill={mugSpillColor} d="M354.48 100.17a7.5 7.5 0 0 1-15 0Z" />
            <path
              fill={theme.colors.textDark}
              d="M346.15 99.17c0 3.73-1.05 6.75-2.34 6.75s-2.33-3.02-2.33-6.75Z"
            />
          </g>
          <g>
            <path fill={mugSpillColor} d="M377.48 100.17a7.5 7.5 0 0 1-15 0Z" />
            <path
              fill={theme.colors.textDark}
              d="M369.15 99.17c0 3.73-1.05 6.75-2.34 6.75s-2.33-3.02-2.33-6.75Z"
            />
          </g>
        </g>
        <g stroke="#ccced0" strokeLinecap="round">
          <path fill="none" d="M328.2 157.07s10.27.68 10.91 9.56" />
          <path
            fill={theme.colors.textDark}
            d="M339.11 151.77s-.52 23.31 1.71 33.57 6.57 18.2 8.93 18.88 10.44 1.23 11.77-.45 1.55-2.61 0-7.16-2.6-5.35-3.33-15.16-.07-20.26 0-23.82"
          />
          <path fill="none" d="M353.85 200.24a9 9 0 0 1 0 4.29" />
          <path fill="none" d="M357.85 200.24a9 9 0 0 1 0 4.29" />
        </g>
        <path
          fill={mugSpillColor}
          d="M407.97 189s9.36 9.76 28.57 7.88 23.48 2.27 23.48 4.8-42.16 0-42.16 0c-4.42 0-9.89-4.36-9.89-9.73Z"
        />
        <path
          fill={theme.colors.textDark}
          d="M406.5 177.58v13.95a10.15 10.15 0 0 0 10.13 10.14h33.46a.84.84 0 0 0 .84-.83v-32.55a.84.84 0 0 0-.84-.84l-5.85.05v-3.81a5.5 5.5 0 0 0-5.49-5.49h-4.65a5.5 5.5 0 0 0-5.48 5.49v3.78l-12.82.01a10.15 10.15 0 0 0-9.3 10.1M449.25 200h-32.62a8.47 8.47 0 0 1-8.46-8.46v-13.95a8.47 8.47 0 0 1 8.46-8.47h32.62Zm-18.96-32.5v-3.81a3.8 3.8 0 0 1 3.81-3.82h4.65a3.8 3.8 0 0 1 3.81 3.82v3.8Z"
        />
        <path
          fill="none"
          stroke={theme.colors.textDark}
          strokeLinecap="round"
          strokeWidth={2}
          d="M443.47 183.17v-9"
        />
        <g fill={mugSpillColor}>
          <path d="M395.97 201.67h87a2 2 0 0 1 2 2h-91a2 2 0 0 1 2-2" />
          <path d="M393.97 203.67h10v11a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4z" />
          <path d="M405.97 253.67h17v10h-17z" />
          <path d="M405.97 313.67h17v10h-17z" />
          <path d="M474.97 253.67h8v10h-8z" />
          <path d="M410.97 203.67h15v50h-15z" />
          <path d="M410.97 263.67h15v50h-15z" />
          <path d="M396.97 321.67h54a2 2 0 0 1 2 2h-58a2 2 0 0 1 2-2" />
          <path d="M396.97 393.67h13a2 2 0 0 1 2 2h-17a2 2 0 0 1 2-2" />
          <path d="M429.97 393.67h13a2 2 0 0 1 2 2h-17a2 2 0 0 1 2-2" />
          <path d="M360.97 261.67h74a2 2 0 0 1 2 2h-78a2 2 0 0 1 2-2" />
          <path d="M430.97 348.67h43a2 2 0 0 1 2 2h-47a2 2 0 0 1 2-2" />
          <path d="M459.97 203.67h7v5a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3z" />
          <path d="M477.97 203.67h7v50h-7z" />
          <path d="M477.97 263.67h7v12.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5z" />
          <path d="M358.97 263.67h4v6a2 2 0 0 1-2 2 2 2 0 0 1-2-2z" />
          <path d="M379.97 263.67h8v12a4 4 0 0 1-4 4 4 4 0 0 1-4-4z" />
          <path d="M436.97 350.67h5v27.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5z" />
          <path d="M436.97 395.67h5v27.5a2.5 2.5 0 0 1-2.5 2.5 2.5 2.5 0 0 1-2.5-2.5z" />
          <path d="M471.97 350.67h4v12a2 2 0 0 1-2 2 2 2 0 0 1-2-2z" />
          <path d="M400.97 323.67h7v12.5a3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.5-3.5z" />
          <path d="M447.97 323.67h5v27h-5z" />
          <path d="M400.97 395.67h7v70h-7z" />
          <path fill="#ef9312" d="M405.97 253.67h17v3h-17z" />
          <path fill="#ef9312" d="M405.97 313.67h17v3h-17z" />
          <path fill="#ef9312" d="M474.97 253.67h8v3h-8z" />
          <g fill="none" stroke="#fbfcfc" strokeLinecap="round" opacity={0.5}>
            <path d="M422.97 224.45v-18.56" />
            <path d="M423.97 310.95v-26.43" />
            <path d="M451.15 338.03v-12.71" />
            <path d="M438.79 422.68v-12.72" />
            <path d="M482.97 251.87v-16.91" />
            <path d="M419.02 239.87v-28.2" />
            <path d="M406.5 427.37v-28.2" />
            <path d="M406.5 440.31v-9.44" />
            <path d="M385.6 276.05v-3.19" />
            <path d="M482.97 271.4v-5.32" />
            <path d="M474.77 361.53v-3.18" />
            <path d="M401.94 215.17v-3.76" />
          </g>
        </g>
        <g fill={mugSpillColor}>
          <path d="m509.97 249.13 24.28-22.64-9.12-6.06 42.43-23.39-25.35 23.4 9.5 6.05Z" />
          <path d="m286.56 331.3-29.32 15.58 7.24 8.22-47.04 11.6 30.54-16.03-7.6-8.3Z" />
          <path d="m517.56 269.2 18.22 5.58.4-6.27 23.8 14.38-18.9-5.89-.29 6.46Z" />
          <path d="m283.23 310.8-16.16-10.1-2 5.95-19.28-20.04 16.74 10.57 1.94-6.17Z" />
        </g>
      </g>
      <g>
        <path
          fill="none"
          stroke="#e8e8e8"
          d="M190.07 436.72h84.53s6.1.4 6.1-5.97c0-5.2-.23-48.93-.23-53.14a3.93 3.93 0 0 1 3.79-4.27h14.1"
        />
        <g fill="#fbfcfc" transform="translate(-9056.03 -1195.33)">
          <path fill="#e8e8e8" d="M9140 1622h106v39h-106z" />
          <circle cx={10} cy={10} r={10} transform="translate(9217 1632)" />
          <path d="M9146 1628h4v28h-4z" />
          <path d="M9162 1628h4v28h-4z" />
          <path d="M9154 1628h4v28h-4z" />
          <path d="M9170 1628h4v28h-4z" />
        </g>
        <g fill="#fbfcfc" transform="translate(-9056.03 -1238.33)">
          <path fill="#e8e8e8" d="M9140 1622h106v39h-106z" />
          <circle cx={10} cy={10} r={10} transform="translate(9217 1632)" />
          <path d="M9146 1628h4v28h-4z" />
          <path d="M9162 1628h4v28h-4z" />
          <path d="M9154 1628h4v28h-4z" />
          <path d="M9170 1628h4v28h-4z" />
        </g>
        <g fill="#fbfcfc" transform="translate(-9056.03 -1281.33)">
          <path fill="#e8e8e8" d="M9140 1622h106v39h-106z" />
          <circle cx={10} cy={10} r={10} transform="translate(9217 1632)" />
          <path d="M9146 1628h4v28h-4z" />
          <path d="M9162 1628h4v28h-4z" />
          <path d="M9154 1628h4v28h-4z" />
          <path d="M9170 1628h4v28h-4z" />
        </g>
        <g transform="translate(-9055.03 -1414.33)">
          <path fill="#e0e0e0" d="M9180 1744h24v10h-24z" />
          <rect
            width={90}
            height={72}
            fill="#e8e8e8"
            rx={3}
            transform="translate(9147 1672)"
          />
          <rect
            width={86}
            height={52}
            fill="#fff"
            rx={2}
            transform="translate(9149 1674)"
          />
          <rect
            width={36}
            height={3}
            fill="#e8e8e8"
            rx={1.5}
            transform="translate(9174 1752)"
          />
        </g>
      </g>
      <path
        fill={theme.colors.textLight}
        d="M638.64 414.8a.56.56 0 0 0-.56.54v.65c.02 3.47.71 14.28 7.4 30.86a56 56 0 0 1 4.07 18.82h27.07a56 56 0 0 1 4.07-18.82c6.69-16.58 7.37-27.4 7.4-30.86v-.66a.56.56 0 0 0-.56-.54Z"
      />
      <g fill="#e8e8e8">
        <path d="M716.5 264.6c-10 4.26-11.84 1.05-23.82 6.26s-11.22 19.67-24.07 32.73-4.5 28.14-4.33 35.9 2.72 74.68 2.72 74.68l4.72.62s-2.95-56.77-2.63-64.84 6.3-2.1 16.92-11 14.31-16.91 15.61-22.73 10.71-10.8 15.5-15.37 1.7-12.86 6.16-18.18c2.82-3.37 4.99-2.41 7.66-1.45a11 11 0 0 0 5.34.82 8.4 8.4 0 0 1 5.18 1.04 3.25 3.25 0 0 0 4.7-3.35 27.6 27.6 0 0 0-5.05-12.38c-2.82-3.96-7.07-5.68-12.01-5.68a33 33 0 0 0-12.6 2.94" />
        <path d="M614.33 286.92a4.3 4.3 0 0 0-4.2 4.13v.07a4 4 0 0 0 .58 2.03 8.2 8.2 0 0 1 1.16 6.38c-.74 3.17-1.57 5.92 4.14 13.82s6.4 11.37 6.54 18.7.54 10.43 8.16 13.6 9.04 9.42 11.09 12.71c2.25 3.63 5.35 3.43 8.33 3.24 3.22-.2 6.3-.4 8.06 4.2 3.25 8.55.23 48.26.23 48.26l3.24.74s6.46-48.42 1.59-64.74c-6-20.12-14.21-14-14.84-18.8-1.34-10.3-1.59-17-6.84-23.12-5.18-6.05-7.87-11.4-16.8-17.18a5 5 0 0 0-.7-.37l-7.99-3.32a4 4 0 0 0-1.64-.35Z" />
        <path d="M711.88 368.55c-3.44 2.12-4.65 6.12-10.05 6.6-5 .44-32.46-.7-32.52 31.47v.23a68 68 0 0 0 .52 7.94l2.57-.23s-.6-21.46 7.54-26.07c4.84-2.74 5.92-1.4 7.67-.06 1.2.92 2.7 1.84 5.94 1.45 7.95-.97 5 .85 10.58 2.43s8.03-3.05 9.95-4.77 6.92-.91 8.97-7.04c1.24-3.72 3.49-3.68 6.17-3.64a11 11 0 0 0 5.6-.94c4.96-2.52 4.2-5.37.63-7.64a4.4 4.4 0 0 0-4.09-.71 12 12 0 0 1-5.59-.25 27 27 0 0 0-6.29-.83 14 14 0 0 0-7.6 2.06" />
        <path d="M601.94 382.46a34 34 0 0 0-9.82 1.48 37 37 0 0 0-11.34 5.91 1.9 1.9 0 0 0-.8 1.52v.08a1.96 1.96 0 0 0 1.8 1.93 26 26 0 0 1 9.3 2.42c2.28 1.16 2.75 3.95 10.33 4.64s9.99 2.07 14.43 5.74 6.5 5.02 12.2 2.18c0 0 5.44-10 18.54-8 7.1 1.07 5.35 14.32 5.35 14.32l2.84.12s-.75-18.08-7.84-23.25c-8.16-5.95-12.13-4.16-14.71-2.37-1.63 1.12-2.7 2.25-3.93 1.44-6.82-4.48-10.94-7.76-17.22-7.81-3.09-.03-5.76-.34-8.64-.35Z" />
        <path d="M735.12 312.73a16 16 0 0 0-2.57.25c-3.81.63-6.84 3.44-16.25 7.13s-12.86 8.16-18.76 12.82-7.4 10.8-10.55 20.03c-1.48 4.3-7.73-2.87-16.96 14.55-3.97 7.51-4.94 20.4-4.96 30.82v.88c.02 8.77.68 15.59.68 15.59l3.06-.08s-1.74-24.48 2.81-31.75c2.46-3.94 5.22-3.14 8.11-2.34 2.64.73 5.38 1.46 8.09-1.44 2.47-2.65 4.94-8.16 12.42-9.65s8.42-4.27 9.93-11 2.79-9.8 9.45-16.01 4.78-9.34 6.36-11.97 7.06-1.44 9.7 2.07l.08.1a3.84 3.84 0 0 0 6.8-2.85c-1.45-13.35-2.46-17.13-7.36-17.15Z" />
        <path d="M600.2 319.48c-2.79.03-3.97 1.47-5.28 2.33a3.1 3.1 0 0 0-1.38 2.55v.1a3 3 0 0 0 .22 1.1l2.17 5.62c1.6 2.62-.23 5.77 6.5 11.9s8.02 9.2 9.6 15.92 2.56 9.49 10.05 10.9 10.02 6.9 12.52 9.52c2.73 2.87 5.47 2.1 8.1 1.35 2.87-.83 5.63-1.66 8.14 2.25 4.63 7.23 3.14 31.73 3.14 31.73l3.06.04s2.86-33.18-4.78-47.24c-9.4-17.32-15.58-10.08-17.1-14.37-3.26-9.2-4.82-15.31-10.77-19.91s-9.44-9.04-18.9-12.63a15 15 0 0 0-5.15-1.16Z" />
      </g>
      <g>
        <g opacity={0.65} transform="translate(-8266.03 -1770.33)">
          <circle
            cx={28}
            cy={28}
            r={28}
            fill="#fbfcfc"
            transform="translate(8929 1820)"
          />
          <circle
            cx={5}
            cy={5}
            r={5}
            fill="#ccced0"
            transform="translate(8952 1843)"
          />
          <path fill="#e8e8e8" d="M8981.78 1847.78a8.16 8.16 0 0 1-16.32 0Z" />
          <path
            fill="#e8e8e8"
            d="M8931.78 1847.78a8.16 8.16 0 0 1 8.16-8.16 8.16 8.16 0 0 1 8.16 8.16Z"
          />
          <path
            fill="#e8e8e8"
            d="M8956.78 1822.78a8.16 8.16 0 0 1 8.16 8.16 8.16 8.16 0 0 1-8.16 8.16Z"
          />
          <path
            fill="#e8e8e8"
            d="M8956.78 1872.78a8.16 8.16 0 0 1-8.16-8.16 8.16 8.16 0 0 1 8.16-8.16Z"
          />
        </g>
        <g stroke="#fbfcfc" strokeLinecap="round" strokeWidth={1}>
          <path d="M637.63 152.76 683 110.31" />
          <path d="M637.63 152.76 683 110.31" transform="translate(3 -28)" />
          <path d="M637.63 152.76 683 110.31" transform="translate(-25 -26)" />
        </g>
      </g>
      <g fill="none">
        <g stroke="#ccced0" transform="translate(0 131.23)">
          <circle cx={15.11} cy={15.11} r={15.11} stroke="none" />
          <circle cx={15.11} cy={15.11} r={14.61} />
        </g>
        <g stroke="#ccced0" transform="translate(811.63 279.88)">
          <circle cx={10.11} cy={10.11} r={10.11} stroke="none" />
          <circle cx={10.11} cy={10.11} r={9.61} />
        </g>
        <g stroke="#ffa803" strokeLinecap="round" strokeWidth={2}>
          <path d="M544.76 8.6h15.21" />
          <path d="M552.37 16.21V1" />
        </g>
        <g stroke="#999" strokeLinecap="round" strokeWidth={2}>
          <path d="M142.43 68.97h9.1" />
          <path d="M146.98 73.51v-9.1" />
        </g>
        <g stroke="#999" strokeLinecap="round" strokeWidth={2}>
          <path d="M195.31 246.06h15.24" />
          <path d="M202.93 253.67v-15.23" />
        </g>
      </g>
    </svg>
  );
}
