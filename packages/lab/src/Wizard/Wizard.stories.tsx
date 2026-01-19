import { useCallback, useContext, useState } from "react";
import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import isChromatic from "chromatic/isChromatic";
import { expect, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvAccordion,
  HvButton,
  HvGrid,
  HvInput,
  HvListContainer,
  HvListItem,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import {
  HvWizard,
  HvWizardContext,
  HvWizardProps,
} from "@hitachivantara/uikit-react-lab";

import mockText from "./mockData";

const meta: Meta<typeof HvWizard> = {
  title: "Lab/Wizard",
  component: HvWizard,
  decorators: [
    (Story) => (
      <div style={{ minHeight: isChromatic() ? 1080 : 600 }}>{Story()}</div>
    ),
  ],
};
export default meta;

const RandomFormComponent = (props: Record<string, any>) => {
  const { context, setContext, tab } = useContext(HvWizardContext);
  const [formData, setFormData] = useState({});

  const [text, setText] = useState(context[tab]?.form.name ?? "");
  const [isValid, setIsValid] = useState(!!context[tab]?.valid);

  const parseStatus = () => {
    return isValid ? "valid" : "invalid";
  };

  const parseStatusMessage = () => {
    return isValid ? "" : "This field is required";
  };

  const toggleContextValid = useCallback(
    (valid: boolean) =>
      setContext({ ...context, [tab]: { ...context[tab], valid } }),
    [context, setContext, tab],
  );

  const handleFieldValue = (fieldName: string, fieldValue: string) => {
    let valid = false;
    setText(fieldValue);

    if (fieldValue !== "") {
      valid = true;
      toggleContextValid(true);
    } else {
      toggleContextValid(false);
    }

    setIsValid(valid);
    setFormData((fd) => {
      const updatedForm = { ...fd, [fieldName]: fieldValue };
      return updatedForm;
    });
    setContext((c) => ({
      ...c,
      [tab]: {
        ...c[tab],
        form: { ...formData, [fieldName]: fieldValue },
        valid,
      },
    }));
  };

  return (
    <form noValidate {...props}>
      <HvGrid container>
        <HvGrid item xs={12}>
          <HvInput
            inputProps={{ autoComplete: "off" }}
            label="Name"
            value={text}
            placeholder="Type the name"
            status={parseStatus()}
            statusMessage={parseStatusMessage()}
            onChange={(evt, value) => handleFieldValue("name", value)}
            required
          />
        </HvGrid>
      </HvGrid>
    </form>
  );
};

export const Main: StoryObj<HvWizardProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  // For a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const button = canvas.getByRole("button", { name: /show wizard/i });
    await userEvent.click(button);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  render: () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = "Cross browser test";
    const labels = {
      previous: "Go Back",
      next: "Go Forward",
    };
    const mockSubmit = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShow(false);
      }, 2000);
    }, []);

    return (
      <>
        <HvButton onClick={() => setShow(true)}>Show Wizard</HvButton>
        <HvWizard
          open={show}
          onClose={() => setShow(false)}
          skippable={false}
          title={title}
          hasSummary={false}
          labels={labels}
          fixedHeight
          loading={loading}
          handleSubmit={mockSubmit}
          // This will only appear if hasSummary is true
          summaryContent={<div>Small summary example</div>}
        >
          <div data-title="Review Model">
            <HvTypography variant="title2" component="h2">
              1. API details
            </HvTypography>
            <HvTypography variant="body" component="p">
              Some text explaining what this section is about. It can be
              multiline but 2 lines are the maximum recommended.
            </HvTypography>
          </div>
          <RandomFormComponent data-title="randomForm" mustValidate />
          <div data-title="Review Parameters">
            <HvTypography variant="title2" component="h2">
              2. Deployment details
            </HvTypography>
            <br />
            {mockText}
          </div>
          <div data-title="last">Last</div>
        </HvWizard>
      </>
    );
  },
};

export const Skippable: StoryObj<HvWizardProps> = {
  // For a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const button = canvas.getByRole("button", { name: /show wizard/i });
    await userEvent.click(button);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  render: () => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const title = "Cross browser test";
    const labels = {
      previous: "Previous Step",
      next: "Next Step",
    };
    const mockSubmit = useCallback(() => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShow(false);
      }, 2000);
    }, []);
    return (
      <>
        <HvButton onClick={() => setShow(true)}>Show Wizard</HvButton>
        <HvWizard
          open={show}
          onClose={() => setShow(false)}
          skippable
          title={title}
          hasSummary={false}
          labels={labels}
          fixedHeight={false}
          loading={loading}
          handleSubmit={mockSubmit}
        >
          <div data-title="Review Model">
            <HvTypography variant="title3" component="h2">
              1. API details
            </HvTypography>
            <HvTypography>
              Some text explaining what this section is about. It can be
              multiline but 2 lines are the maximum recommended.
            </HvTypography>
          </div>
          <RandomFormComponent data-title="randomForm" mustValidate />
          <div data-title="Review Parameters">
            <HvTypography variant="title3" component="h2">
              2. Deployment details
            </HvTypography>
            <br />
            {mockText}
          </div>
          <div data-title="last">Last</div>
        </HvWizard>
      </>
    );
  },
};

export const ComponentBreakDown: StoryObj<HvWizardProps> = {
  parameters: {
    ...setupChromatic(["DS5 dawn", "Pentaho dawn"]),
  },
  // For visual testing and a11y
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const button = canvas.getByRole("button", { name: /show wizard/i });
    await userEvent.click(button);
    const summaryButton = canvas.getByRole("button", { name: /summary/i });
    await userEvent.click(summaryButton);
    await expect(canvas.getByRole("dialog")).toBeInTheDocument();
  },
  render: () => {
    const [open, setOpen] = useState(false);

    const handleClose = useCallback(
      (
        evt: React.MouseEvent<HTMLButtonElement> | {},
        reason?: "backdropClick" | "escapeKeyDown",
      ) => {
        if (reason !== "backdropClick") {
          setOpen(false);
        }
      },
      [],
    );

    const handleSubmit = useCallback(() => {
      setOpen(false);
    }, []);

    const classes = {
      summaryContainer: css({
        padding: 16,
      }),
      accordionSpacing: css({
        "& > li": {
          paddingLeft: 32,
        },
      }),
    };

    const summaryContent = (
      <div className={classes.summaryContainer}>
        <HvAccordion label="Basics" headingLevel={3}>
          <HvListContainer
            className={classes.accordionSpacing}
            interactive
            condensed
          >
            <HvListItem>Views</HvListItem>
            <HvListItem>Parameters</HvListItem>
          </HvListContainer>
        </HvAccordion>
        <HvAccordion label="Code Base" headingLevel={3}>
          <HvListContainer
            className={classes.accordionSpacing}
            interactive
            condensed
          >
            <HvListItem>Settings</HvListItem>
            <HvListItem>Network</HvListItem>
          </HvListContainer>
        </HvAccordion>
        <HvAccordion label="Execution" headingLevel={3}>
          <HvListContainer
            className={classes.accordionSpacing}
            interactive
            condensed
          >
            <HvListItem>
              <HvTypography variant="label" component="span">
                Status
              </HvTypography>{" "}
              Open
            </HvListItem>
            <HvListItem>
              <HvTypography variant="label" component="span">
                Date
              </HvTypography>{" "}
              12/08/2018
            </HvListItem>
            <HvListItem>
              <HvTypography variant="label" component="span">
                Assignee
              </HvTypography>{" "}
              Management
            </HvListItem>
          </HvListContainer>
        </HvAccordion>
        {mockText}
      </div>
    );

    return (
      <>
        <HvButton onClick={() => setOpen(true)}>Show Wizard</HvButton>
        <HvWizard
          open={open}
          hasSummary
          summaryContent={summaryContent}
          onClose={handleClose}
          handleSubmit={handleSubmit}
          title="Super component"
          customStep={{ width: { xs: 200, sm: 250, md: 420, lg: 650 } }}
        >
          <div>1. Content</div>
          <div>
            <h2>2. Description</h2>
            <p>{mockText}</p>
          </div>
        </HvWizard>
      </>
    );
  },
};
