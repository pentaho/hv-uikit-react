import styled from "@emotion/styled";
import {
  ExtractNames,
  HvBaseProps,
  HvBreakpoints,
  HvTooltip,
  HvTypography,
  useTheme,
  useWidth,
} from "@hitachivantara/uikit-react-core";
import { theme } from "@hitachivantara/uikit-styles";

import {
  HvDefaultNavigation,
  HvDefaultNavigationProps,
  HvStepProps,
} from "./DefaultNavigation";
import {
  HvSimpleNavigation,
  HvSimpleNavigationProps,
} from "./SimpleNavigation";
import { staticClasses, useClasses } from "./StepNavigation.styles";
import { SEPARATOR_WIDTH, TITLE_MARGIN, TITLE_WIDTH } from "./utils";

export { staticClasses as stepNavigationClasses };

export type HvStepNavigationClasses = ExtractNames<typeof useClasses>;

export interface HvStepNavigationProps extends HvBaseProps {
  /** Type of step navigation. */
  type?: "Simple" | "Default";
  /** Steps to show on the component. */
  steps: Array<
    Pick<
      HvStepProps,
      "state" | "title" | "onClick" | "className" | "disabled"
    > & {
      /** Class names to override styles on the separator component after the step. */
      separatorClassName?: string;
      /** Class names to override styles on the title component above the step. */
      titleClassName?: string;
    }
  >;
  /** Sets one of the standard sizes of the steps. @default useWidth()  */
  stepSize?: "xs" | "sm" | "md" | "lg" | "xl";
  /**
   * Width of the component element on each breakpoint screen resolution.
   * If undefined and the step component has no title, the width of the separator element will be 100px.
   * */
  width?: Partial<Record<HvBreakpoints, number>>;
  /** Defines either show a title or only a tooltip on each step component. */
  showTitles?: boolean;
  /** A Jss Object used to override or extend the styles applied to the empty state StepNavigation. */
  classes?: HvStepNavigationClasses;
}

/**
 * Navigation page with steps.
 *
 * You need to define the `steps` displayed on the component so that itself can be drawn on the UI.
 * On each step, you need to define a `state` - 'Pending', 'Failed', 'Completed', 'Current', 'Disabled' -
 * and a `title` to be shown as a tooltip or a text above of the step. You can also defined `className`, `separatorClassName`, and `titleClassName` to override the default styles.
 *
 * If the step component has titles, each one will have 215px of width by default.
 */
export const HvStepNavigation = ({
  className,
  classes: classesProp,
  width,
  steps,
  stepSize,
  showTitles,
  type = "Default",
  "aria-label": ariaLabel,
  ...others
}: HvStepNavigationProps) => {
  const { classes, css, cx } = useClasses(classesProp);

  const { activeTheme } = useTheme();

  // current breakpoint 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  const breakpoint = useWidth();
  // step configurations
  const stepSizeKey =
    stepSize ?? (["xs", "sm"].includes(breakpoint) ? "sm" : "md");
  const hasTitles = showTitles ?? !["xs", "sm"].includes(breakpoint);

  const styledLi = (containerSize: any) =>
    styled("li")({
      width: containerSize,
      height: containerSize,
    });

  const styledDiv = (containerSize: any) =>
    styled("div")({
      width: containerSize,
      height: containerSize,
    });

  const styledSeparatorElement = (
    title: string,
    separatorClassName: string | undefined,
    separatorHeight: any,
    separatorWidth: any,
    backgroundColor: any,
  ) => {
    const widthValue = separatorWidth - 2 * 4;

    return (
      <li
        aria-hidden
        key={`separator-${title}`}
        className={cx(
          css({
            height: separatorHeight,
            width: widthValue,
            backgroundColor,
            margin: `0 4px`,
          }),
          classes.separator,
        )}
      >
        <div className={separatorClassName} />
      </li>
    );
  };

  const drawItems = ({
    separatorValues: { minWidth, maxWidth, getColor, height },
    stepValues: { minSize, maxSize, StepComponent },
  }: any) => {
    const items = steps.reduce<React.ReactNode[]>(
      (acc, { state, title, separatorClassName, ...props }, index): any => {
        const containerSize = state === "Current" ? maxSize : minSize;
        const StepContainer = styledLi(containerSize);
        const Step = styledDiv(Math.max(containerSize, 30));
        const stepProps = {
          size: stepSizeKey,
          state,
          title,
          number: index + 1,
          ...props,
        };
        const stepElement = (
          <StepContainer key={`step-${title}`} className={classes.li}>
            {hasTitles ? (
              <StepComponent
                key={`step-${title}`}
                aria-label={`${title}`}
                {...stepProps}
              />
            ) : (
              <HvTooltip
                placement="bottom"
                title={<HvTypography>{`${index + 1}. ${title}`}</HvTypography>}
              >
                <div>
                  <Step className={classes.li}>
                    <StepComponent aria-label={`${title}`} {...stepProps} />
                  </Step>
                </div>
              </HvTooltip>
            )}
          </StepContainer>
        );
        if (index < steps.length - 1) {
          const separatorElement = styledSeparatorElement(
            title,
            separatorClassName,
            height,
            [steps[index + 1].state, state].includes("Current")
              ? minWidth
              : maxWidth,
            getColor(
              steps[index + 1].state === "Disabled" ? "Disabled" : state,
              theme,
            ),
          );

          acc.push(stepElement, separatorElement);
          return acc;
        }
        acc.push(stepElement);
        return acc;
      },
      [],
    );

    return <ol className={classes.ol}>{items}</ol>;
  };

  const getDynamicValues: HvDefaultNavigationProps["getDynamicValues"] = (
    stepsWidth,
  ) => {
    const themeBreakpoints = activeTheme?.breakpoints.values || {};
    const maxWidth =
      width?.[breakpoint] ??
      Math.max(
        Number(hasTitles) * (TITLE_WIDTH + TITLE_MARGIN) * steps.length -
          TITLE_MARGIN,
        SEPARATOR_WIDTH * (steps.length - 1) + stepsWidth,
      );
    const next = Object.keys(themeBreakpoints).find((_, index, self) =>
      index - 1 >= 0 ? self[index - 1] === breakpoint : false,
    );
    const navWidth = Math.min(
      maxWidth,
      next ? (themeBreakpoints as any)[next] : maxWidth,
    );
    const titleWidth =
      Number(hasTitles) * Math.ceil((navWidth + TITLE_MARGIN) / steps.length);
    const separatorWidth =
      Number(!hasTitles) *
      Math.ceil((navWidth - stepsWidth) / (steps.length - 1));
    return { width: navWidth, titleWidth, separatorWidth };
  };

  const getTitles: HvSimpleNavigationProps["getTitles"] = (
    getTitleProps,
  ): React.ReactNode =>
    hasTitles ? (
      <div className={classes.titles}>
        {steps.map(({ title: rawTitle, state, titleClassName }, index) => {
          const {
            variant = "label",
            title = rawTitle,
            titleWidth = 0,
            titleDisabled = false,
          } = getTitleProps?.({
            state,
            rawTitle,
            number: index + 1,
          }) ?? {};

          return (
            <HvTypography
              variant={variant}
              className={cx(
                css({
                  textAlign: "center",
                  width: titleWidth - TITLE_MARGIN,
                  marginRight: TITLE_MARGIN,
                }),
                titleClassName,
              )}
              disabled={titleDisabled}
              key={title}
            >
              {title}
            </HvTypography>
          );
        })}
      </div>
    ) : null;

  const StepNavigation = {
    Default: HvDefaultNavigation,
    Simple: HvSimpleNavigation,
  }[type];

  return (
    <StepNavigation
      numSteps={steps.length}
      stepSize={stepSizeKey}
      getTitles={getTitles}
      getDynamicValues={getDynamicValues}
      className={cx(classes.root, className)}
      {...others}
    >
      {({ stepsWidth, navWidth, ...itemsProps }) => (
        <nav
          style={{
            width: `${navWidth}px`,
            margin: 0,
          }}
          aria-label={ariaLabel}
        >
          {drawItems(itemsProps)}
        </nav>
      )}
    </StepNavigation>
  );
};
