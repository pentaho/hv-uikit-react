import { useContext, useEffect, useState } from "react";
import {
  ExtractNames,
  HvBaseProps,
  HvButton,
  HvDialogTitle,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Report } from "@hitachivantara/uikit-react-icons";

import { HvStepNavigation, HvStepNavigationProps } from "../../StepNavigation";
import { HvStepProps } from "../../StepNavigation/DefaultNavigation";
import { HvWizardContext, HvWizardTab } from "../WizardContext";
import { staticClasses, useClasses } from "./WizardTitle.styles";

export { staticClasses as wizardTitleClasses };

export type HvWizardTitleClasses = ExtractNames<typeof useClasses>;

export interface HvWizardTitleProps extends HvBaseProps {
  /** Title for the wizard. */
  title?: string;
  /** Shows the summary button. */
  hasSummary?: boolean;
  /** An object containing all the labels for the wizard header. */
  labels?: {
    /** Summary button label. */
    summary?: string;
  };
  /** Custom object to define type, size and width of the StepNavigation component */
  customStep?: Pick<HvStepNavigationProps, "type" | "stepSize" | "width">;
  /** A Jss Object used to override or extend the styles applied to the empty state Wizard. */
  classes?: HvWizardTitleClasses;
}

const switchTabState = (
  state: HvWizardTab | undefined,
  currentTab: number,
  index: number,
) => {
  if (state?.loading) return "Pending";
  if (index === currentTab) return "Current";
  if (state?.valid) return "Completed";
  if (state?.disabled) return "Disabled";
  if (state?.valid === null) return "Enabled";
  if (state?.touched && state?.valid === false) return "Failed";
  return "Enabled";
};

export const HvWizardTitle = ({
  title,
  hasSummary = false,
  labels = {},
  classes: classesProp,
  customStep = {},
}: HvWizardTitleProps) => {
  const { context, setSummary, tab, setTab } = useContext(HvWizardContext);

  const { classes } = useClasses(classesProp);

  const [steps, setSteps] = useState<HvStepProps[]>([]);

  useEffect(() => {
    return () => {
      setSummary(false);
    };
  }, [setSummary]);

  const toggleSummary = () => {
    setSummary((prevValue) => !prevValue);
  };

  useEffect(() => {
    const contextArray = Object.entries(context);

    if (!contextArray.length) return;

    const updatedSteps = contextArray.map<HvStepProps>(
      ([, childState], index) => ({
        title: childState?.["data-title"] ?? childState?.name ?? `${index + 1}`,
        state: switchTabState(childState, tab, index),
        onClick: () => setTab(index),
      }),
    );

    setSteps(updatedSteps);
  }, [context, tab, setTab]);

  return (
    <HvDialogTitle className={classes.root} showIcon={false}>
      {title && (
        <HvTypography variant="title3" component="div">
          {title}
        </HvTypography>
      )}
      {!!steps.length && (
        <HvStepNavigation
          className={classes.stepContainer}
          steps={steps}
          type="Default"
          stepSize="xs"
          width={{
            xs: 200,
            sm: 350,
            md: 600,
            lg: 800,
            xl: 1000,
          }}
          {...customStep}
        />
      )}
      {hasSummary && (
        <HvButton
          variant="secondarySubtle"
          className={classes.summaryButton}
          onClick={toggleSummary}
          startIcon={<Report />}
        >
          {`${labels.summary ?? "Summary"}`}
        </HvButton>
      )}
    </HvDialogTitle>
  );
};
