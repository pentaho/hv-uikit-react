/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { useEffect, useState } from "react";
import {
  HvButton,
  HvDialog,
  HvDialogActions,
  HvDialogContent,
  HvDialogTitle,
  HvInput,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

type FormData = {
  name: string;
  email: string;
};

type StepProps = {
  data: FormData;
  onChange?: (changes: Partial<FormData>) => void;
};

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ name: "", email: "" });

  useEffect(() => {
    if (!open) {
      setStep(0);
      setFormData({ name: "", email: "" });
    }
  }, [open]);

  const handleChange = (changes: Partial<FormData>) =>
    setFormData((d) => ({ ...d, ...changes }));

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      handleNext();
    } else {
      console.log(formData);
      setOpen(false);
    }
  };

  return (
    <>
      <HvDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <HvDialogTitle>
          {step === 0
            ? "Enter your name"
            : step === 1
              ? "Enter your email"
              : "Is this information correct?"}
        </HvDialogTitle>

        <form onSubmit={handleSubmit}>
          <HvDialogContent>
            {step === 0 && <Step1 data={formData} onChange={handleChange} />}
            {step === 1 && <Step2 data={formData} onChange={handleChange} />}
            {step === 2 && <Step3 data={formData} />}
          </HvDialogContent>

          <HvDialogActions>
            <HvButton variant="secondarySubtle" onClick={() => setOpen(false)}>
              Cancel
            </HvButton>
            <div className="flex gap-xs">
              {step > 0 && (
                <HvButton
                  variant="secondarySubtle"
                  type="button"
                  onClick={handleBack}
                >
                  Previous
                </HvButton>
              )}
              <HvButton variant="primary" type="submit">
                {step < 2 ? "Next" : "Confirm"}
              </HvButton>
            </div>
          </HvDialogActions>
        </form>
      </HvDialog>

      <HvButton variant="secondarySubtle" onClick={() => setOpen(true)}>
        Open Multi-Step Dialog
      </HvButton>
    </>
  );
}

const Step1 = ({ data, onChange }: StepProps) => (
  <HvInput
    label="Name"
    name="name"
    value={data.name}
    onChange={(e) => onChange?.({ name: e.target.value })}
  />
);

const Step2 = ({ data, onChange }: StepProps) => (
  <HvInput
    label="Email"
    name="email"
    type="email"
    value={data.email}
    onChange={(e) => onChange?.({ email: e.target.value })}
  />
);

const Step3 = ({ data }: StepProps) => (
  <div className="flex flex-col gap-xxs">
    <div className="flex gap-xs">
      <HvTypography>Name:</HvTypography>
      <HvTypography>{data.name}</HvTypography>
    </div>
    <div className="flex gap-xs">
      <HvTypography>Email:</HvTypography>
      <HvTypography>{data.email}</HvTypography>
    </div>
  </div>
);
