import { useCallback, useEffect, useMemo, useState } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-core";

import type { HvStepNavigationProps } from "../StepNavigation";
import { staticClasses, useClasses } from "./Wizard.styles";
import { HvWizardActions, type HvWizardActionsProps } from "./WizardActions";
import {
  HvWizardContainer,
  type HvWizardContainerProps,
} from "./WizardContainer";
import { HvWizardContent } from "./WizardContent";
import { HvWizardContext, type HvWizardTabs } from "./WizardContext";
import { HvWizardTitle, type HvWizardTitleProps } from "./WizardTitle";

export { staticClasses as wizardClasses };

export type HvWizardClasses = ExtractNames<typeof useClasses>;

export interface HvWizardProps extends Omit<HvWizardContainerProps, "classes"> {
  /** Current state of the Wizard. */
  open: boolean;
  /** Function executed on close. */
  onClose: (
    event: React.MouseEvent<HTMLButtonElement> | {},
    reason?: "escapeKeyDown" | "backdropClick",
  ) => void;
  /** Function executed on submit. */
  handleSubmit: (context: HvWizardTabs) => void;
  /** Title for the wizard. */
  title?: string;
  /** An object containing all the labels for the wizard. */
  labels?: HvWizardActionsProps["labels"] & HvWizardTitleProps["labels"];
  /** Shows the summary button. */
  hasSummary?: boolean;
  /** The content of the summary. */
  summaryContent?: React.ReactNode;
  /** Enables the skip button. */
  skippable?: boolean;
  /** Forces minimum height to the component. */
  fixedHeight?: boolean;
  /** Whether the loading animation is shown. */
  loading?: boolean;
  /** Custom object to define type, size and width of the StepNavigation component */
  customStep?: Pick<HvStepNavigationProps, "type" | "stepSize" | "width">;
  /** A Jss Object used to override or extend the styles applied to the empty state Wizard. */
  classes?: HvWizardClasses;
}

export const HvWizard = ({
  className,
  children,
  onClose,
  handleSubmit,
  title,
  open,
  skippable = true,
  loading = false,
  hasSummary = false,
  summaryContent,
  labels = {
    cancel: "Cancel",
    next: "Next",
    previous: "Previous",
    skip: "Skip",
    submit: "Submit",
    summary: "Summary",
  },
  fixedHeight = false,
  customStep,
  classes: classesProp,
  ...others
}: HvWizardProps) => {
  const { classes, cx } = useClasses(classesProp);

  const [context, setContext] = useState<HvWizardTabs>({});
  const [summary, setSummary] = useState(false);
  const [tab, setTab] = useState(0);

  const handleClose = useCallback(
    (
      evt: React.MouseEvent<HTMLButtonElement> | {},
      reason?: "backdropClick" | "escapeKeyDown",
    ) => {
      if (reason !== "backdropClick") {
        onClose?.(evt, reason);
      }
    },
    [onClose],
  );

  // on unmount
  useEffect(() => {
    return () => {
      if (!open) {
        setContext((c) =>
          Object.entries(c).reduce<HvWizardTabs>((acc, [key, child]) => {
            acc[+key] = {
              ...child,
              touched: false,
            };
            return acc;
          }, {}),
        );
        setTab(0);
      }
    };
  }, [open]);

  const value = useMemo(
    () => ({ context, setContext, summary, setSummary, tab, setTab }),
    [context, setContext, summary, setSummary, tab, setTab],
  );

  return (
    <HvWizardContext.Provider value={value}>
      <HvWizardContainer
        className={cx(classes.root, className)}
        onClose={handleClose}
        open={open}
        {...others}
      >
        <HvWizardTitle
          title={title}
          hasSummary={hasSummary}
          labels={labels}
          customStep={customStep}
        />
        <HvWizardContent
          loading={loading}
          fixedHeight={fixedHeight}
          summaryContent={summaryContent}
        >
          {children}
        </HvWizardContent>
        <HvWizardActions
          loading={loading}
          skippable={skippable}
          labels={labels}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      </HvWizardContainer>
    </HvWizardContext.Provider>
  );
};
