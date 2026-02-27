import { theme } from "@hitachivantara/uikit-react-core";

export interface CatServerProps extends React.ComponentProps<"svg"> {
  title?: string;
}

export const CatServer = ({ title, ...others }: CatServerProps) => {
  const mugSpillColor = "#ffa82f";

  return (
    <svg role="img" viewBox="554 333 833 488" {...others}>
      <title>{title || "Black cat spilling drink on server rack"}</title>
      <g>
        <g id="Center_illustration" data-name="Center illustration">
          <g id="Coffee_puddle" data-name="Coffee puddle" fill={mugSpillColor}>
            <ellipse
              cx="62"
              cy="9"
              rx="62"
              ry="9"
              transform="translate(898 797)"
            />
            <ellipse
              cx="12"
              cy="2.5"
              rx="12"
              ry="2.5"
              transform="translate(1013 812)"
            />
            <ellipse
              cx="4.5"
              cy="2"
              rx="4.5"
              ry="2"
              transform="translate(1006 817)"
            />
          </g>
          <g
            id="Center_server"
            data-name="Center server"
            transform="translate(-4)"
          >
            <rect
              id="server_column"
              data-name="server column"
              width="180"
              height="202"
              rx="3"
              transform="translate(871 565)"
              fill="#ccced0"
            />
            <g id="Server_04" data-name="Server 04">
              <rect
                width="207"
                height="70"
                rx="3"
                transform="translate(857 732)"
                fill="#e8e8e8"
              />
              <line
                x2="41"
                transform="translate(1034 787.5) rotate(-90)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                x2="41"
                transform="translate(1014 787.5) rotate(-90)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                x2="41"
                transform="translate(1044 787.5) rotate(-90)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                x2="41"
                transform="translate(1024 787.5) rotate(-90)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <g id="fan" transform="translate(-8053 -1069)">
                <rect
                  width="40"
                  height="40"
                  rx="6"
                  transform="translate(8925 1816)"
                  fill="#999"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="16"
                  transform="translate(8929 1820)"
                  fill="#fff"
                />
                <circle
                  cx="3"
                  cy="3"
                  r="3"
                  transform="translate(8942 1833)"
                  fill="#ccced0"
                />
                <path
                  d="M9.4,6A4.7,4.7,0,0,1,0,6Z"
                  transform="translate(8950 1830)"
                  fill="#e8e8e8"
                />
                <path
                  d="M9.4,6A4.7,4.7,0,0,1,0,6Z"
                  transform="translate(8940 1842) rotate(180)"
                  fill="#e8e8e8"
                />
                <path
                  d="M9.4,6A4.7,4.7,0,0,1,0,6Z"
                  transform="translate(8939 1831) rotate(-90)"
                  fill="#e8e8e8"
                />
                <path
                  d="M9.4,6A4.7,4.7,0,0,1,0,6Z"
                  transform="translate(8951 1841) rotate(90)"
                  fill="#e8e8e8"
                />
              </g>
            </g>
            <g id="Server_03" data-name="Server 03">
              <rect
                width="207"
                height="62"
                rx="3"
                transform="translate(857 660)"
                fill="#e8e8e8"
              />
              <rect
                width="207"
                height="8"
                transform="translate(857 687)"
                fill="#fbfcfc"
              />
            </g>
            <g
              id="Server_02"
              data-name="Server 02"
              transform="translate(-8053 -1009)"
            >
              <rect
                width="207"
                height="50"
                rx="3"
                transform="translate(8910 1609)"
                fill="#e8e8e8"
              />
              <g id="Group_33307" data-name="Group 33307">
                <line
                  x2="41"
                  transform="translate(8930 1629)"
                  fill="none"
                  stroke="#ccced0"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <line
                  x2="41"
                  transform="translate(8930 1639)"
                  fill="none"
                  stroke="#ccced0"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9055 1629)"
                  fill="#fff"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9070 1629)"
                  fill="#ccced0"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9085 1629)"
                  fill="#fff"
                />
              </g>
            </g>
            <g
              id="Server_01"
              data-name="Server 01"
              transform="translate(-8053 -1069)"
            >
              <rect
                width="207"
                height="50"
                rx="3"
                transform="translate(8910 1609)"
                fill="#e8e8e8"
              />
              <g id="Group_33307-2" data-name="Group 33307">
                <line
                  x2="41"
                  transform="translate(8930 1629)"
                  fill="none"
                  stroke="#ccced0"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <line
                  x2="41"
                  transform="translate(8930 1639)"
                  fill="none"
                  stroke="#ccced0"
                  strokeLinecap="round"
                  strokeWidth="2"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9055 1629)"
                  fill="#fff"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9070 1629)"
                  fill="#ccced0"
                />
                <circle
                  cx="5"
                  cy="5"
                  r="5"
                  transform="translate(9085 1629)"
                  fill="#fff"
                />
              </g>
            </g>
          </g>
          <g id="Cat">
            <g
              id="body_and_head"
              data-name="body and head"
              transform="translate(-8388.276 -1072)"
            >
              <path
                d="M9403.177,1477.931a37.274,37.274,0,0,1,13.032,12c7.406-2.2,12.413-.812,15.808,0,5.94-6.131,10.955-10.849,14.89-12,3.471,4.4,6.614,19.436,6.286,31.143s-5.554,17.436-10.183,19.287c-.617,8.872,3.588,26.184,7.521,32.125a53.823,53.823,0,0,0,11.9,12.882c4.4,3.626,4.736,9.427,2.45,12.351s-6.989,3.3-10.6,1.86c-1.223-3.189,0-4.465,0-4.465s-10.763-2.817-14-7.07c-1.17,1.223.264,2.02,2.487,11.026s-3.814,16.76-3.814,16.76,4.891,2.711,4.247,5.769-2.187,2.486-6.536,2.646c-1.744.064-7.979-.091-9.789,0-1.921.1.556.458-2.756.712-5.528.425-10.109-1.028-12.148-.99-6.118-.021-5.026.054-12.158,0s-13.094.244-18.675-.872-12.32-3.824-20.743,0-5.2,10.7-1.91,11.922,4.567,4.731,1.91,6.964-8.771,2.04-12.492-1.894-8.189-11.791,0-21.817,25.081-8.194,30.122-7.131c-3.482-6.83-8.631-17.35,0-33.988s19.728-25.7,23.372-30.01a28.339,28.339,0,0,0,4.921-7.92s-9.558-6.789-9.93-18.145S9399.6,1481.3,9403.177,1477.931Z"
                transform="translate(-122)"
                fill={theme.colors.textDark}
              />
              <path
                d="M9421.62,1519.26a4.83,4.83,0,0,1,8.311,0s-2.522.108-3.054,1.529-.49,1.584-1.082,1.584-.382-.2-1.116-1.584S9421.62,1519.26,9421.62,1519.26Z"
                transform="translate(-123.995 -3)"
                fill="#696969"
              />
              <g
                id="Group_33313"
                data-name="Group 33313"
                transform="translate(3.592)"
              >
                <path
                  d="M15,7.5a7.5,7.5,0,0,1-15,0Z"
                  transform="translate(9279.188 1501)"
                  fill={mugSpillColor}
                />
                <path
                  d="M4.673,4c0,3.725-1.046,6.744-2.336,6.744S0,7.725,0,4Z"
                  transform="translate(9281.188 1503.5)"
                  fill={theme.colors.textDark}
                />
              </g>
              <g
                id="Group_33314"
                data-name="Group 33314"
                transform="translate(26.592)"
              >
                <path
                  d="M15,7.5a7.5,7.5,0,0,1-15,0Z"
                  transform="translate(9279.188 1501)"
                  fill={mugSpillColor}
                />
                <path
                  d="M4.673,4c0,3.725-1.046,6.744-2.336,6.744S0,7.725,0,4Z"
                  transform="translate(9281.188 1503.5)"
                  fill={theme.colors.textDark}
                />
              </g>
            </g>
            <g
              id="front_paw"
              data-name="front paw"
              transform="translate(-8388.276 -1072)"
            >
              <path
                d="M9393.5,1565.393s10.274.681,10.918,9.563"
                transform="translate(-122)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M9404.417,1560.1s-.52,23.307,1.712,33.563,6.568,18.2,8.929,18.882,10.441,1.227,11.771-.447,1.544-2.614,0-7.162-2.6-5.346-3.336-15.159-.072-20.262,0-23.824"
                transform="translate(-122)"
                fill={theme.colors.textDark}
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M9419.151,1608.57a9.245,9.245,0,0,1,0,4.286"
                transform="translate(-122)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M9419.151,1608.57a9.245,9.245,0,0,1,0,4.286"
                transform="translate(-118)"
                fill="none"
                stroke="#ccced0"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </g>
          </g>
          <g id="Mug">
            <path
              id="coffee"
              d="M0-1.426S9.363,8.341,28.571,6.461,52.046,8.725,52.046,11.25s-42.16,0-42.16,0C5.467,11.25,0,6.9,0,1.524Z"
              transform="translate(963 526.75)"
              fill={mugSpillColor}
            />
            <path
              id="coffee_mug"
              data-name="coffee mug"
              d="M24.089,0H10.139A10.149,10.149,0,0,0,0,10.137L0,43.594a.836.836,0,0,0,.837.837h32.55a.836.836,0,0,0,.837-.837l-.05-5.851h3.813a5.493,5.493,0,0,0,5.487-5.487v-4.65a5.493,5.493,0,0,0-5.487-5.487H34.206L34.193,9.3A10.152,10.152,0,0,0,24.089,0ZM1.674,42.757l0-32.62a8.473,8.473,0,0,1,8.463-8.463h13.95a8.473,8.473,0,0,1,8.463,8.463l0,32.62Zm32.5-18.964h3.813A3.817,3.817,0,0,1,41.8,27.605v4.65a3.817,3.817,0,0,1-3.813,3.813H34.175Z"
              transform="translate(961.525 538) rotate(-90)"
              fill={theme.colors.text}
            />
            <line
              id="mug_reflection"
              data-name="mug reflection"
              y1="9"
              transform="translate(998.5 510.5)"
              fill="none"
              stroke={theme.colors.text}
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g
            id="Dripping_coffee"
            data-name="Dripping coffee"
            fill={mugSpillColor}
          >
            <path
              d="M2,0H89a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(949 538)"
            />
            <path
              d="M0,0H10a0,0,0,0,1,0,0V11a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V0A0,0,0,0,1,0,0Z"
              transform="translate(949 540)"
            />
            <rect width="17" height="10" transform="translate(961 590)" />
            <rect width="17" height="10" transform="translate(961 650)" />
            <rect width="8" height="10" transform="translate(1030 590)" />
            <rect width="15" height="50" transform="translate(966 540)" />
            <rect width="15" height="50" transform="translate(966 600)" />
            <path
              d="M2,0H56a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(950 658)"
            />
            <path
              d="M2,0H15a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(950 730)"
            />
            <path
              d="M2,0H15a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(983 730)"
            />
            <path
              d="M2,0H76a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(914 598)"
            />
            <path
              d="M2,0H45a2,2,0,0,1,2,2V2a0,0,0,0,1,0,0H0A0,0,0,0,1,0,2V2A2,2,0,0,1,2,0Z"
              transform="translate(984 685)"
            />
            <path
              d="M0,0H7A0,0,0,0,1,7,0V5A3,3,0,0,1,4,8H3A3,3,0,0,1,0,5V0A0,0,0,0,1,0,0Z"
              transform="translate(1015 540)"
            />
            <rect width="7" height="50" transform="translate(1033 540)" />
            <path
              d="M0,0H7A0,0,0,0,1,7,0V12.5A3.5,3.5,0,0,1,3.5,16h0A3.5,3.5,0,0,1,0,12.5V0A0,0,0,0,1,0,0Z"
              transform="translate(1033 600)"
            />
            <path
              d="M0,0H4A0,0,0,0,1,4,0V6A2,2,0,0,1,2,8H2A2,2,0,0,1,0,6V0A0,0,0,0,1,0,0Z"
              transform="translate(914 600)"
            />
            <path
              d="M0,0H8A0,0,0,0,1,8,0V12a4,4,0,0,1-4,4H4a4,4,0,0,1-4-4V0A0,0,0,0,1,0,0Z"
              transform="translate(935 600)"
            />
            <path
              d="M0,0H5A0,0,0,0,1,5,0V27.5A2.5,2.5,0,0,1,2.5,30h0A2.5,2.5,0,0,1,0,27.5V0A0,0,0,0,1,0,0Z"
              transform="translate(992 687)"
            />
            <path
              d="M0,0H5A0,0,0,0,1,5,0V27.5A2.5,2.5,0,0,1,2.5,30h0A2.5,2.5,0,0,1,0,27.5V0A0,0,0,0,1,0,0Z"
              transform="translate(992 732)"
            />
            <path
              d="M0,0H4A0,0,0,0,1,4,0V12a2,2,0,0,1-2,2H2a2,2,0,0,1-2-2V0A0,0,0,0,1,0,0Z"
              transform="translate(1027 687)"
            />
            <path
              d="M0,0H7A0,0,0,0,1,7,0V12.5A3.5,3.5,0,0,1,3.5,16h0A3.5,3.5,0,0,1,0,12.5V0A0,0,0,0,1,0,0Z"
              transform="translate(956 660)"
            />
            <rect width="5" height="27" transform="translate(1003 660)" />
            <rect width="7" height="70" transform="translate(956 732)" />
            <rect
              width="17"
              height="3"
              transform="translate(961 590)"
              fill="#ef9312"
            />
            <rect
              width="17"
              height="3"
              transform="translate(961 650)"
              fill="#ef9312"
            />
            <rect
              width="8"
              height="3"
              transform="translate(1030 590)"
              fill="#ef9312"
            />
            <g id="dripping_light" data-name="dripping light" opacity="0.5">
              <path
                d="M3.968,18.675-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 979, 541.704)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.968,18.675-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 968.639, 606.209)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.968,18.675-2.871-6.851"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 980, 628.209)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M2.458,13.039-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 1007.18, 661.126)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M2.458,13.039-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 994.821, 745.769)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.543,17.09-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 1039, 570.769)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M6.464,27.991-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 975.049, 547.484)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M6.464,27.991-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 962.525, 734.984)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M1.611,9.878-.833.758"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 962.525, 766.678)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.968,18.675,3.144,15.6"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 941.639, 593.307)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M4.518,20.727,3.144,15.6"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 1039, 586.527)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.968,18.675,3.144,15.6"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 1030.797, 678.788)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
              <path
                d="M3.968,18.675l-.974-3.636"
                transform="matrix(0.966, 0.259, -0.259, 0.966, 957.973, 532.429)"
                fill="none"
                stroke="#fbfcfc"
                strokeLinecap="round"
                strokeWidth="1"
              />
            </g>
          </g>
          <g
            id="Eletric_sparks"
            data-name="Eletric sparks"
            fill={mugSpillColor}
          >
            <path
              d="M9572.562,1670.322l24.283-22.64-9.122-6.056,42.43-23.391-25.348,23.391,9.5,6.056Z"
              transform="translate(-8507.562 -1084.866)"
            />
            <path
              d="M9572.562,1670.322l24.283-22.64-9.122-6.056,42.43-23.391-25.348,23.391,9.5,6.056Z"
              transform="matrix(-0.966, -0.259, 0.259, -0.966, 9656.072, 4760.454)"
            />
            <path
              d="M9572.561,1648.128l13.938-12.994-5.236-3.475,24.352-13.425-14.547,13.425,5.455,3.475Z"
              transform="translate(-2286.372 -8508.61) rotate(60)"
            />
            <path
              d="M9572.561,1648.128l13.938-12.994-5.236-3.475,24.352-13.425-14.547,13.425,5.455,3.475Z"
              transform="matrix(-0.259, -0.966, 0.966, -0.259, 1725.458, 10321.078)"
            />
          </g>
        </g>
        <g id="Left_server_column" data-name="Left server column">
          <path
            id="cable"
            d="M9249.1,773.042h84.526s6.106.407,6.106-5.969c0-5.2-.234-48.924-.234-53.135a3.925,3.925,0,0,1,3.785-4.27h14.105"
            transform="translate(-8504)"
            fill="none"
            stroke="#e8e8e8"
            strokeWidth="1"
          />
          <g
            id="Server_03-2"
            data-name="Server 03"
            transform="translate(-8501 -859)"
          >
            <rect
              width="106"
              height="39"
              transform="translate(9140 1622)"
              fill="#e8e8e8"
            />
            <circle
              cx="10"
              cy="10"
              r="10"
              transform="translate(9217 1632)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9146 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9162 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9154 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9170 1628)"
              fill={theme.colors.textLight}
            />
          </g>
          <g
            id="Server_02-2"
            data-name="Server 02"
            transform="translate(-8501 -902)"
          >
            <rect
              width="106"
              height="39"
              transform="translate(9140 1622)"
              fill="#e8e8e8"
            />
            <circle
              cx="10"
              cy="10"
              r="10"
              transform="translate(9217 1632)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9146 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9162 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9154 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9170 1628)"
              fill={theme.colors.textLight}
            />
          </g>
          <g
            id="Server_01-2"
            data-name="Server 01"
            transform="translate(-8501 -945)"
          >
            <rect
              width="106"
              height="39"
              transform="translate(9140 1622)"
              fill="#e8e8e8"
            />
            <circle
              cx="10"
              cy="10"
              r="10"
              transform="translate(9217 1632)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9146 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9162 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9154 1628)"
              fill={theme.colors.textLight}
            />
            <rect
              width="4"
              height="28"
              transform="translate(9170 1628)"
              fill={theme.colors.textLight}
            />
          </g>
          <g id="Mac" transform="translate(-8500 -1078)">
            <rect
              width="24"
              height="10"
              transform="translate(9180 1744)"
              fill="#e0e0e0"
            />
            <rect
              width="90"
              height="72"
              rx="3"
              transform="translate(9147 1672)"
              fill="#e8e8e8"
            />
            <rect
              width="86"
              height="52"
              rx="2"
              transform="translate(9149 1674)"
              fill="#fff"
            />
            <rect
              width="36"
              height="3"
              rx="1.5"
              transform="translate(9174 1752)"
              fill="#e8e8e8"
            />
          </g>
        </g>
        <g id="Plant" transform="translate(-23.796)">
          <path
            d="M.56,0A.555.555,0,0,0,0,.543C0,.62,0,.707,0,.8v.4C.025,4.664.715,15.478,7.395,32.06a56.268,56.268,0,0,1,4.076,18.819H38.542A56.234,56.234,0,0,1,42.616,32.06C49.3,15.476,49.986,4.662,50.011,1.2V.8c0-.095,0-.182,0-.26A.555.555,0,0,0,49.451,0Z"
            transform="translate(1216.9 751.121)"
            fill={theme.colors.textLight}
          />
          <path
            d="M55.039,2.935C45.045,7.189,43.206,3.981,31.223,9.19S20,28.852,7.155,41.916s-4.5,28.139-4.336,35.9S5.544,152.5,5.544,152.5l4.722.62S7.312,96.347,7.633,88.28s6.3-2.113,16.916-11.006S38.866,60.366,40.166,54.547s10.709-10.8,15.491-15.371S57.369,26.321,61.823,21c2.824-3.373,4.989-2.415,7.656-1.458a10.849,10.849,0,0,0,5.342.826A8.414,8.414,0,0,1,80,21.411,3.249,3.249,0,0,0,84.7,18.054,27.578,27.578,0,0,0,79.652,5.681C76.834,1.719,72.587,0,67.642,0a32.916,32.916,0,0,0-12.6,2.935"
            transform="translate(1240.281 598)"
            fill="#e8e8e8"
          />
          <path
            d="M4.2,0A4.276,4.276,0,0,0,0,4.127V4.2A4.065,4.065,0,0,0,.58,6.23,8.184,8.184,0,0,1,1.733,12.6C1,15.774.165,18.527,5.879,26.427s6.4,11.372,6.54,18.7.533,10.428,8.153,13.594,9.04,9.428,11.093,12.719c2.256,3.621,5.352,3.429,8.331,3.239,3.223-.205,6.309-.411,8.058,4.189,3.253,8.556.238,48.268.238,48.268l3.237.737s6.457-48.416,1.587-64.742c-6-20.112-14.214-14-14.836-18.8-1.339-10.289-1.593-16.991-6.844-23.115-5.183-6.048-7.87-11.4-16.794-17.178a4.614,4.614,0,0,0-.713-.372L5.951.347A4.429,4.429,0,0,0,4.309,0Z"
            transform="translate(1188.957 623.251)"
            fill="#e8e8e8"
          />
          <path
            d="M42.566,2.063c-3.442,2.121-4.644,6.115-10.044,6.594C27.511,9.1.06,7.964,0,40.128v.235a67.486,67.486,0,0,0,.514,7.943l2.572-.229S2.481,26.614,10.628,22c4.836-2.735,5.922-1.4,7.67-.054,1.2.917,2.7,1.836,5.935,1.442,7.951-.963,5,.853,10.585,2.433s8.027-3.045,9.948-4.77,6.92-.911,8.971-7.034c1.244-3.724,3.489-3.685,6.172-3.646a11.29,11.29,0,0,0,5.592-.94c4.962-2.514,4.206-5.365.634-7.643a4.374,4.374,0,0,0-4.088-.706A11.888,11.888,0,0,1,56.458.832,27.383,27.383,0,0,0,50.172,0a13.929,13.929,0,0,0-7.606,2.064"
            transform="translate(1248.137 702.814)"
            fill="#e8e8e8"
          />
          <path
            d="M21.963,0a34.038,34.038,0,0,0-9.82,1.483A37.228,37.228,0,0,0,.806,7.394,1.9,1.9,0,0,0,0,8.91v.078a1.958,1.958,0,0,0,1.814,1.931,25.522,25.522,0,0,1,9.29,2.419c2.283,1.163,2.754,3.954,10.329,4.648s9.992,2.066,14.433,5.736,6.493,5.022,12.19,2.179c0,0,5.445-10,18.55-8.005,7.092,1.076,5.354,14.33,5.354,14.33l2.832.112S74.05,14.263,66.958,9.092C58.8,3.143,54.826,4.93,52.244,6.719c-1.626,1.126-2.7,2.252-3.929,1.446C41.5,3.684,37.375.4,31.095.348,28.009.319,25.334.017,22.452,0Z"
            transform="translate(1158.799 718.784)"
            fill="#e8e8e8"
          />
          <path
            d="M70.055,0a16.427,16.427,0,0,0-2.57.25c-3.819.628-6.84,3.441-16.255,7.125S38.369,15.54,32.473,20.2s-7.4,10.789-10.556,20.025c-1.471,4.307-7.73-2.867-16.953,14.551C.987,62.29.025,75.173,0,85.595v.88c.021,8.771.68,15.588.68,15.588l3.061-.072S2,77.51,6.552,70.234c2.46-3.935,5.224-3.138,8.11-2.338,2.638.729,5.379,1.46,8.087-1.44,2.473-2.648,4.945-8.157,12.421-9.645s8.42-4.276,9.932-11,2.789-9.8,9.444-16.013,4.784-9.343,6.364-11.973,7.057-1.432,9.7,2.078l.081.1a3.839,3.839,0,0,0,6.792-2.853C76.045,3.8,75.029.021,70.135,0Z"
            transform="translate(1243.893 649.058)"
            fill="#e8e8e8"
          />
          <path
            d="M6.658,0C3.867.025,2.688,1.473,1.38,2.332A3.091,3.091,0,0,0,0,4.883v.093a3.206,3.206,0,0,0,.215,1.1l2.173,5.627c1.607,2.615-.231,5.765,6.49,11.9s8.031,9.2,9.61,15.916,2.559,9.486,10.048,10.9,10.019,6.895,12.52,9.517c2.735,2.869,5.468,2.111,8.1,1.353,2.876-.826,5.633-1.657,8.139,2.254,4.631,7.23,3.142,31.725,3.142,31.725l3.061.041s2.857-33.178-4.78-47.239c-9.4-17.319-15.586-10.081-17.1-14.371C38.36,24.5,36.8,18.387,30.851,13.785S21.405,4.745,11.956,1.157A15.274,15.274,0,0,0,6.8,0Z"
            transform="translate(1172.367 655.807)"
            fill="#e8e8e8"
          />
        </g>
        <g id="Fan-2" data-name="Fan">
          <g
            id="office_fan"
            data-name="office fan"
            transform="translate(-7711 -1434)"
            opacity="0.65"
          >
            <circle
              cx="28"
              cy="28"
              r="28"
              transform="translate(8929 1820)"
              fill="#fbfcfc"
            />
            <circle
              cx="5"
              cy="5"
              r="5"
              transform="translate(8952 1843)"
              fill="#ccced0"
            />
            <path
              d="M16.319,6A8.16,8.16,0,0,1,0,6Z"
              transform="translate(8965.464 1841.782)"
              fill="#e8e8e8"
            />
            <path
              d="M16.319,0A8.16,8.16,0,0,1,8.16,8.16,8.16,8.16,0,0,1,0,0Z"
              transform="translate(8948.1 1847.782) rotate(180)"
              fill="#e8e8e8"
            />
            <path
              d="M16.319,0A8.16,8.16,0,0,1,8.16,8.16,8.16,8.16,0,0,1,0,0Z"
              transform="translate(8956.781 1839.1) rotate(-90)"
              fill="#e8e8e8"
            />
            <path
              d="M16.319,0A8.16,8.16,0,0,1,8.16,8.16,8.16,8.16,0,0,1,0,0Z"
              transform="translate(8956.781 1856.464) rotate(90)"
              fill="#e8e8e8"
            />
          </g>
          <g
            id="wind_lines"
            data-name="wind lines"
            transform="translate(1167.464 409.839)"
          >
            <path
              d="M0,52.743,32.81,0"
              transform="matrix(0.966, 0.259, -0.259, 0.966, 41.954, 0)"
              fill="none"
              stroke="#fbfcfc"
              strokeLinecap="round"
              strokeWidth="1"
            />
            <path
              d="M0,52.743,32.81,0"
              transform="matrix(0.966, 0.259, -0.259, 0.966, 38.859, 28.302)"
              fill="none"
              stroke="#fbfcfc"
              strokeLinecap="round"
              strokeWidth="1"
            />
            <path
              d="M0,52.743,32.81,0"
              transform="matrix(0.966, 0.259, -0.259, 0.966, 13.651, 3.095)"
              fill="none"
              stroke="#fbfcfc"
              strokeLinecap="round"
              strokeWidth="1"
            />
          </g>
        </g>
        <g id="Elements">
          <g
            id="Ellipse_1321"
            data-name="Ellipse 1321"
            transform="translate(555.028 467.558)"
            fill="none"
            stroke="#ccced0"
            strokeWidth="1"
          >
            <circle cx="15.114" cy="15.114" r="15.114" stroke="none" />
            <circle cx="15.114" cy="15.114" r="14.614" fill="none" />
          </g>
          <g
            id="Ellipse_1375"
            data-name="Ellipse 1375"
            transform="translate(1366.654 616.201)"
            fill="none"
            stroke="#ccced0"
            strokeWidth="1"
          >
            <circle cx="10.114" cy="10.114" r="10.114" stroke="none" />
            <circle cx="10.114" cy="10.114" r="9.614" fill="none" />
          </g>
          <g id="PLUS" transform="translate(1099.791 337.326)">
            <path
              d="M693.276-6486.255h15.21"
              transform="translate(-693.276 6493.861)"
              fill="none"
              stroke="#ffa803"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M0,0H15.211"
              transform="translate(7.605 15.211) rotate(-90)"
              fill="none"
              stroke="#ffa803"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g
            id="PLUS-2"
            data-name="PLUS"
            transform="translate(697.455 400.742)"
          >
            <path
              d="M693.276-6486.255h9.1"
              transform="translate(-693.276 6490.804)"
              fill="none"
              stroke="#999"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M0,0H9.1"
              transform="translate(4.548 9.097) rotate(-90)"
              fill="none"
              stroke="#999"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
          <g
            id="PLUS-3"
            data-name="PLUS"
            transform="translate(750.341 574.766)"
          >
            <path
              d="M693.276-6486.255H708.51"
              transform="translate(-693.276 6493.873)"
              fill="none"
              stroke="#999"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <path
              d="M0,0H15.234"
              transform="translate(7.617 15.234) rotate(-90)"
              fill="none"
              stroke="#999"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
