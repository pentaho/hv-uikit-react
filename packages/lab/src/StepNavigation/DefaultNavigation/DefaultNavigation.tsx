import { ReactNode } from "react";
import {
  HvBaseProps,
  HvTheme,
  HvTypographyVariants,
} from "@hitachivantara/uikit-react-core";

import { HvStep, HvStepProps } from "./Step";
import { getColor, stepSizes } from "./utils";

export type ComponentChildProps = {
  stepsWidth: number;
  navWidth: number;
  separatorValues: {
    minWidth: number;
    maxWidth: number;
    getColor: (state: HvStepProps["state"], activeTheme: HvTheme) => any;
    height: number;
  };
  stepValues: {
    minSize: number;
    maxSize: number;
    StepComponent: React.ComponentType<HvStepProps>;
  };
};

export interface HvDefaultNavigationProps
  extends Omit<HvBaseProps, "children"> {
  /** Number of steps to show on the component. */
  numSteps: number;
  /** Sets one of the standard sizes of the steps. */
  stepSize: "xs" | "sm" | "md" | "lg" | "xl";
  /** Returns a `ReactNode` of the titles container. */
  getTitles: (
    getTitleProps?: (params: {
      state: HvStepProps["state"];
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

export const HvDefaultNavigation = ({
  numSteps,
  stepSize,
  getTitles,
  getDynamicValues,
  className,
  children,
  ...other
}: HvDefaultNavigationProps) => {
  // step values
  const { container: maxSize, avatar: minSize } = stepSizes[stepSize];
  const StepComponent = HvStep;
  //

  const stepsWidth = maxSize + minSize * (numSteps - 1);
  const { width, titleWidth, separatorWidth } = getDynamicValues(stepsWidth);

  // separator values
  const maxWidth = Math.max(titleWidth - minSize, separatorWidth);
  const minWidth = Math.max(
    titleWidth - (maxSize + minSize) * 0.5,
    separatorWidth,
  );
  //

  const Steps = children;

  const titles = getTitles(({ state }) => ({
    variant: "label",
    titleWidth,
    titleDisabled: state === "Disabled",
  }));

  return (
    <div {...other}>
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
            minSize,
            maxSize,
            StepComponent,
          },
        }}
      />
      {titles}
    </div>
  );
};
