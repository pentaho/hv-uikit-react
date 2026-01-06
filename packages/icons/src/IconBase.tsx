import { forwardRef, memo } from "react";
import styled from "@emotion/styled";
import { getColor, HvColorAny, HvSize } from "@hitachivantara/uikit-styles";

import { HvIconContainer, HvIconContainerProps } from "./IconContainer";
import { getSizeStyles } from "./utils";

const getColorVars = (colorArray: string[]) => {
  return colorArray.reduce<Record<string, string>>((acc, value, index) => {
    acc[`--color-${index + 1}`] = value;
    return acc;
  }, {});
};

const getIconColors = (
  palette: string[] = [],
  color?: HvColorAny | HvColorAny[],
) => {
  // Copy array to avoid mutating the palette
  const colorArray = [...palette];

  if (typeof color === "string") {
    colorArray[0] = color;
  } else if (Array.isArray(color)) {
    colorArray.forEach((_, i) => {
      colorArray[i] = color[i];
    });
  }

  return colorArray;
};

export type IconSize = "XS" | "S" | "M" | "L";

export interface IconBaseProps extends Omit<HvIconContainerProps, "color"> {
  /**
   * A color or array of colors to override the default icon colors.
   * Accepts any valid CSS color or color from the UI Kit palette.
   * @example "primary" "bgPage" "#FF0000" "purple" "inherit"
   */
  color?: HvColorAny | HvColorAny[];
  /**
   * The size of the SVG icon. Takes in a `number` in pixels or any `HvSize` or `IconSize`.
   *
   * @example
   * size={16} // 16px
   * size="S" // 16px
   * size="sm" // 16px
   * size="md" // 32px
   *
   * @default "S"
   */
  size?: HvSize | IconSize | number;
  /** Sets one of the standard sizes of the icons @deprecated use `size` instead */
  iconSize?: IconSize;
  /** Props passed down to the svg element. */
  svgProps?: React.SVGProps<SVGSVGElement>;
}

const StyledSvg = styled("svg")({
  margin: "auto",
  color: "inherit",
  fill: "currentcolor",
  width: "1em",
  height: "1em",
  fontSize: "inherit",
});

export type IconType = React.ForwardRefExoticComponent<IconBaseProps>;

const IconBaseInternal = (
  props: IconBaseProps & {
    palette?: string[];
    iconName: string;
    viewBox?: string;
  },
  ref: React.Ref<HTMLDivElement>,
) => {
  const {
    // internal props
    children,
    palette,
    iconName,
    viewBox,

    // standard props
    title: titleProp,
    // keep aria-label for `HvTooltip`+icon compatibility
    "aria-label": ariaLabel,
    color,
    size,
    iconSize,
    style: styleProp,

    svgProps,
    ...others
  } = props;
  const colorArray = getIconColors(palette, color);
  const [color0, ...otherColors] = colorArray.map((c) => getColor(c)!);
  const title = titleProp ?? ariaLabel;

  const inheritColor =
    !color && palette?.length === 1 && palette?.[0] === "text";

  return (
    <HvIconContainer
      ref={ref}
      data-name={iconName}
      style={{
        ...(!inheritColor && { color: color0 }),
        ...getColorVars(otherColors),
        ...getSizeStyles(iconName ?? "", size),
        ...styleProp,
      }}
      size={size ?? iconSize}
      {...others}
    >
      <StyledSvg
        viewBox={viewBox}
        focusable={false}
        role={title ? "img" : "none"}
        {...svgProps}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </StyledSvg>
    </HvIconContainer>
  );
};

export const IconBase = memo(forwardRef(IconBaseInternal));

export const createHvIcon = (
  iconName: string,
  viewBox: string,
  palette: string[],
  children: React.ReactNode,
): IconType => {
  const IconComponent = (
    props: IconBaseProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    return (
      <IconBase
        ref={ref}
        iconName={iconName}
        viewBox={viewBox}
        palette={palette}
        {...props}
      >
        {children}
      </IconBase>
    );
  };
  IconComponent.displayName = `HvIcon${iconName}`;

  return memo(forwardRef(IconComponent));
};
