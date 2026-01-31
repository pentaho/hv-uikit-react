import { forwardRef, memo, useMemo } from "react";
import styled from "@emotion/styled";
import { useTheme } from "@hitachivantara/uikit-react-utils";
import { getColor, HvColorAny, HvSize } from "@hitachivantara/uikit-styles";

/** sizes for the <svg> icon */
const svgSizeMap = {
  xs: 12,
  sm: 16,
  md: 32,
  lg: 96,
  xl: 112,
} satisfies Record<HvSize, number>;

interface SvgProps extends Omit<React.SVGProps<SVGSVGElement>, "rotate"> {
  size?: HvSize | number;
  color?: HvColorAny;
  compact?: boolean;
  title?: string;
  rotation?: boolean;
}

export const SvgBase = styled("svg")({
  display: "inline-block",
  fill: "currentcolor",
  width: "1em",
  height: "1em",
  fontSize: 16,
  flexShrink: 0,
  transition: "rotate 0.2s ease",
});

const Svg = styled(SvgBase)<SvgProps>(({ size, color, compact, rotation }) => ({
  rotate: rotation ? "180deg" : undefined,
  margin: compact ? 0 : size === "xs" ? 10 : 8,
  color: getColor(color) ?? "inherit",
  fontSize: svgSizeMap[size as HvSize] ?? size ?? svgSizeMap.sm,
}));

const defaultIconPathMap = {
  // Semantic icons
  Success:
    "M6.39 12 4 9.61l.7-.7 1.62 1.6 4.65-5.57.77.64zM8 15a7 7 0 0 1-4.94-2.06A7.02 7.02 0 1 1 8 15m8-7a8 8 0 1 0-8 8 8 8 0 0 0 8-8",
  Caution: "M7.5 6h1v4h-1zm0 7h1v-1h-1zm8.5 2H0L8 1zM1.72 14h12.56L8 3.02z",
  Fail: "M7.5 4h1v6h-1zm0 8h1v-1h-1zM16 8a8 8 0 1 0-8 8 8 8 0 0 0 8-8m-1 0a7 7 0 1 1-7-7 7 7 0 0 1 7 7",
  Info: "M8 16a8 8 0 1 1 8-8 8 8 0 0 1-8 8M8 1a6.96 6.96 0 0 0-7 6.91V8a6.96 6.96 0 0 0 6.91 7H8a6.96 6.96 0 0 0 7-6.91V8a6.96 6.96 0 0 0-6.91-7zm-.5 11h1V6h-1zm0-7h1V4h-1z",
  // Arrows/Navigation
  CaretDown: "m8 11.53-6.13-6.13.93-.93L8 9.67l5.2-5.2.93.93z",
  CaretRight: "m5.4 14.13-.93-.93L9.67 8l-5.2-5.2.93-.93L11.53 8z",
  DotsHorizontal: "M9.1 7v2h-2V7zM2 7v2h2V7zm10 0v2h2V7z",
  DotsVertical: "M7 6.9h2v2H7zM7 4h2V2H7zm0 10h2v-2H7z",
  Start:
    "M2.99 16.05H2v-16h.99zm2.97-8 7.34 7.41.7-.7-6.64-6.71L14 1.33l-.7-.7z",
  Backwards: "M11.3 15.5 4 8 11.3.5l.7.8L5.38 8 12 14.8z",
  Forwards: "M4.79 15.5 4 14.8 10.62 8 4 1.3l.79-.8L12 8z",
  End: "M13 0h1v16h-1zM2.58.58l-.7.7L8.57 8l-6.7 6.71.7.71L10 8z",
  // Others
  Add: "M16 8.5H8.5V16h-1V8.5H0v-1h7.5V0h1v7.5H16z",
  Close:
    "m8.7 8 5.3 5.3-.7.7L8 8.7 2.7 14l-.7-.7L7.3 8 2 2.7l.7-.7L8 7.3 13.3 2l.7.7z",
  Search:
    "M15.07 14.52 10.5 9.95a5.96 5.96 0 1 0-.72.7l4.58 4.58zM5.9 11A4.95 4.95 0 0 1 1 6v-.1A4.95 4.95 0 0 1 6 1h.1A4.95 4.95 0 0 1 11 6v.1A4.95 4.95 0 0 1 6 11z",
  SortAsc: "M10.24 7 6 11.24 1.76 7z",
  SortDesc: "M1.76 5 6 .76 10.24 5z",
  Sort: "M10.24 7 6 11.24 1.76 7zM1.76 5 6 .76 10.24 5z",
  // single-use icons in Widgets
  Calendar:
    "M10.5 2V0h-1v2h-3V0h-1v2H0v14h16V2zM15 15H1V3h14zM3 6h2v2H3zm4 0h2v2H7zm4 0h2v2h-2zm-8 4h2v2H3zm4 0h2v2H7zm4 0h2v2h-2z",
  ColorPicker:
    "M15.41.57a2.05 2.05 0 0 0-2.82 0l-2.12 2.12-1.42-1.42-.7.71L14 7.64l.7-.7-1.4-1.42 2.1-2.12a2 2 0 0 0 0-2.83zm-.69 2.11L12.59 4.8l-1.42-1.42 2.12-2.12a1 1 0 0 1 1.42 1.42zM0 13v3h3l9-9-3-3zm2.59 2H1v-1.58l8-8L10.59 7z",
  CurrentStep: "M16 8a8 8 0 0 1-8 8 8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8",
  Delete: "M12 1H4V0h8zm4 1v1h-2.1L13 16H3L2.1 3H0V2zm-3 1H3.1L4 15h8.1z",
  Doc: "M9 0H2v16h12V5zm3.6 5H9V1.4zm.4 10H3V1h5v5h5z",
  Edit: "M13.17 7.07 8.93 2.83 11.76 0 16 4.24zm-2.83-4.24 2.83 2.83 1.42-1.42-2.83-2.83zm-2.7 2.7L1 12.16V15h2.83l6.65-6.65-2.83-2.83m-.01-1.4 4.24 4.24L4.24 16H0v-4.24z",
  Filters: "M1 2v1.6l6 6.1V14h2V9.7l6-6.1V2zM0 1h16v3l-6 6v5H6v-4.9L0 4z",
  Fullscreen:
    "M16 0v4.5h-1V1.7l-4.65 4.65-.7-.7L14.29 1H11.5V0zM4.5 1V0H0v4.5h1V1.7l4.65 4.65.7-.7L1.71 1zM15 14.3l-4.65-4.65-.7.7L14.29 15H11.5v1H16v-4.5h-1zM5.65 9.64 1 14.29V11.5H0V16h4.5v-1H1.7l4.65-4.65z",
  Menu: "M1 2v1.6l6 6.1V14h2V9.7l6-6.1V2zM0 1h16v3l-6 6v5H6v-4.9L0 4z",
  OtherStep: "M12 8a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4",
  Time: "M8 15a7.02 7.02 0 1 0-4.94-2.06A7 7 0 0 0 8 15m0 1a8 8 0 1 1 8-8 8 8 0 0 1-8 8m2.65-4.65L7.5 8.21V3h1v4.8l2.85 2.85z",
  User: "M9.6 8.7A4.5 4.5 0 0 0 8.04 0H8a4.5 4.5 0 0 0-4.5 4.46v.04a4.6 4.6 0 0 0 2.9 4.2A7.7 7.7 0 0 0 .5 16h1a6.5 6.5 0 0 1 6.47-6.5H8a6.5 6.5 0 0 1 6.5 6.47V16h1a7.5 7.5 0 0 0-5.9-7.3M4.5 4.5A3.54 3.54 0 0 1 8 1a3.54 3.54 0 0 1 3.5 3.5A3.54 3.54 0 0 1 8 8a3.54 3.54 0 0 1-3.5-3.5",
  Remove: "M0 7.5h16v1H0z",
} satisfies Record<string, string>;

function HvIconInternal(
  props: SvgProps & { name: keyof typeof defaultIconPathMap; rotate?: boolean },
  ref: React.Ref<SVGSVGElement>,
) {
  const { name, title, "aria-label": ariaLabel, rotate, ...others } = props;
  const { activeTheme } = useTheme();

  const iconsPathMap = useMemo(
    () => ({ ...defaultIconPathMap, ...activeTheme?.icons }),
    [activeTheme?.icons],
  );

  const isDefaultIcon = iconsPathMap[name] === defaultIconPathMap[name];

  return (
    <Svg
      ref={ref}
      data-name={name}
      rotation={rotate}
      viewBox={(!isDefaultIcon && activeTheme?.icons?.viewBox) || "0 0 16 16"}
      focusable={false}
      aria-label={ariaLabel}
      role={title || ariaLabel ? "img" : "none"}
      {...others}
    >
      {title ? <title>{title}</title> : null}
      <path d={iconsPathMap[name]} />
    </Svg>
  );
}

export const HvIcon = memo(forwardRef(HvIconInternal));
