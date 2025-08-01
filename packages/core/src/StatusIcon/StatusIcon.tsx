import { forwardRef } from "react";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { HvSize } from "@hitachivantara/uikit-styles";

import { HvIconContainer } from "../IconContainer";
import { HvIcon, SvgBase } from "../icons";
import { HvBaseProps } from "../types/generic";
import type { HvCalloutVariant } from "../utils/Callout";
import { staticClasses, useClasses } from "./StatusIcon.styles";

export { staticClasses as statusIconClasses };

export type HvStatusIconClasses = ExtractNames<typeof useClasses>;

export type HvStatusIconVariant = HvCalloutVariant;

export type HvStatusIconType = "full" | "simple";

type Weight = "regular" | "duotone" | "fill";

export interface HvStatusIconProps extends HvBaseProps {
  /** Variant of the snackbar. */
  variant?: HvStatusIconVariant;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** The size of the icon. */
  size?: HvSize;
  /** The type of status icon. */
  type?: HvStatusIconType;
  /** Icon style */
  weight?: Weight;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvStatusIconClasses;
}

const variantIconMap = {
  success: "Success",
  warning: "Caution",
  error: "Fail",
  info: "Info",
} as const;

const pentahoIconsMap: Record<
  keyof typeof variantIconMap,
  Record<Weight, React.ReactNode>
> = {
  success: {
    regular: (
      <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
    ),
    fill: (
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
    ),
    duotone: (
      <>
        <path
          d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
          opacity="0.2"
        />
        <path d="M173.66,98.34a8,8,0,0,1,0,11.32l-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35A8,8,0,0,1,173.66,98.34ZM232,128A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
      </>
    ),
  },
  warning: {
    regular: (
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
    ),
    fill: (
      <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
    ),
    duotone: (
      <>
        <path
          d="M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z"
          opacity="0.2"
        />
        <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z" />
      </>
    ),
  },
  error: {
    regular: (
      <path d="M128,72a8,8,0,0,1,8,8v56a8,8,0,0,1-16,0V80A8,8,0,0,1,128,72ZM116,172a12,12,0,1,0,12-12A12,12,0,0,0,116,172Zm124-44a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Zm-16,0L128,32,32,128,128,224h0Z" />
    ),
    fill: (
      <path d="M235.33,116.72,139.28,20.66a16,16,0,0,0-22.56,0l-96,96.06a16,16,0,0,0,0,22.56l96.05,96.06h0a16,16,0,0,0,22.56,0l96.05-96.06a16,16,0,0,0,0-22.56ZM120,80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
    ),
    duotone: (
      <>
        <path
          d="M229.67,133.62l-96,96a7.94,7.94,0,0,1-11.24,0l-96-96a7.94,7.94,0,0,1,0-11.24l96.05-96a7.94,7.94,0,0,1,11.24,0l96,96.05A7.94,7.94,0,0,1,229.67,133.62Z"
          opacity="0.2"
        />
        <path d="M128,72a8,8,0,0,1,8,8v56a8,8,0,0,1-16,0V80A8,8,0,0,1,128,72ZM116,172a12,12,0,1,0,12-12A12,12,0,0,0,116,172Zm124-44a15.85,15.85,0,0,1-4.67,11.28l-96.05,96.06a16,16,0,0,1-22.56,0h0l-96-96.06a16,16,0,0,1,0-22.56l96.05-96.06a16,16,0,0,1,22.56,0l96.05,96.06A15.85,15.85,0,0,1,240,128Zm-16,0L128,32,32,128,128,224h0Z" />
      </>
    ),
  },
  info: {
    regular: (
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z" />
    ),
    fill: (
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-4,48a12,12,0,1,1-12,12A12,12,0,0,1,124,72Zm12,112a16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40a8,8,0,0,1,0,16Z" />
    ),
    duotone: (
      <>
        <path
          d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
          opacity="0.2"
        />
        <path d="M144,176a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176Zm88-48A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128ZM124,96a12,12,0,1,0-12-12A12,12,0,0,0,124,96Z" />
      </>
    ),
  },
};

/**
 * A status icon represents the status of a process or an entity.
 *
 * @experimental
 * This component is experimental and its API might change in future releases.
 */
export const HvStatusIcon = forwardRef<
  // no-indent
  React.ComponentRef<"div">,
  HvStatusIconProps
>(function HvStatusIcon(props, ref) {
  const {
    classes: classesProp,
    className,
    variant = "default",
    customIcon,
    size = "sm",
    type = "full",
    weight = "regular",
  } = useDefaultProps("HvStatusIcon", props);
  const { classes, cx } = useClasses(classesProp);
  const { activeTheme } = useTheme();

  return (
    <div
      ref={ref}
      data-variant={variant}
      data-type={type}
      data-size={size}
      className={cx(classes.root, className)}
    >
      {activeTheme?.name === "pentahoPlus" && !customIcon ? (
        <HvIconContainer size={size}>
          <SvgBase viewBox="0 0 256 256" className={classes.icon}>
            {pentahoIconsMap[variant as keyof typeof pentahoIconsMap]?.[weight]}
          </SvgBase>
        </HvIconContainer>
      ) : (
        <HvIconContainer size={size}>
          {customIcon || (
            <HvIcon
              compact
              className={classes.icon}
              name={variantIconMap[variant as keyof typeof variantIconMap]}
            />
          )}
        </HvIconContainer>
      )}
    </div>
  );
});
