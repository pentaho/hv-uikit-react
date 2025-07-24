import { ReactNode } from "react";
import {
  HvBaseProps,
  HvTheme,
  HvTypographyVariants,
} from "@hitachivantara/uikit-react-core";

import { HvDot, HvDotProps } from "./Dot";
import { dotSizes, getColor } from "./utils";

export type ComponentChildProps = {
  stepsWidth: number;
  navWidth: number;
  separatorValues: {
    minWidth: number;
    maxWidth: number;
    getColor: (state: HvDotProps["state"], activeTheme: HvTheme) => any;
    height: number;
  };
  stepValues: {
    minSize: number;
    maxSize: number;
    StepComponent: React.ComponentType<HvDotProps>;
  };
};

export interface HvSimpleNavigationProps extends Omit<HvBaseProps, "children"> {
  /** Sets one of the standard sizes of the steps. */
  stepSize?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Number of steps to show on the component. */
  numSteps: number;
  /** Returns a `ReactNode` of the titles container. */
  getTitles: (
    getTitleProps?: (params: {
      state: HvDotProps["state"];
      rawTitle: string;
      number: number;
    }) => {
      variant?: HvTypographyVariants;
      title?: string;
      titleWidth?: number;
      titleDisabled?: boolean;
    },
  ) => ReactNode;
  /** Returns dynamic width values of the component (width, titleWidth, separatorWidth). */
  getDynamicValues: (stepsWidth: number) => {
    width: number;
    titleWidth: number;
    separatorWidth: number;
  };
  /** Component to render Step Navigation with props = {separatorValues, stepValues, stepsWidth} */
  children: React.FunctionComponent<ComponentChildProps>;
}

export const HvSimpleNavigation = ({
  numSteps,
  stepSize = "sm",
  getTitles,
  getDynamicValues,
  children,
  ...others
}: HvSimpleNavigationProps) => {
  // step values
  const dotSize = dotSizes[stepSize];
  const StepComponent = HvDot;
  //

  const stepsWidth = (numSteps + 0.5) * dotSize;
  const { width, titleWidth, separatorWidth } = getDynamicValues(stepsWidth);

  // separator values
  const maxWidth = Math.max(titleWidth - dotSize, separatorWidth);
  const minWidth = Math.max(titleWidth - dotSize * 1.25, separatorWidth);
  //

  const Steps = children;

  const titles = getTitles(({ rawTitle, number }) => ({
    variant: "label",
    title: `${number}. ${rawTitle}`,
    titleWidth,
  }));

  return (
    <div {...others}>
      {titles}
      <Steps
        {...{
          stepsWidth,
          navWidth: width,
          separatorValues: {
            minWidth,
            maxWidth,
            getColor,
            height: 1,
          },
          stepValues: {
            minSize: dotSize,
            maxSize: 1.5 * dotSize,
            StepComponent,
          },
        }}
      />
    </div>
  );
};
