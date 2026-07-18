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
import {
  HvButton,
  HvCheckBox,
  HvDatePicker,
  HvGrid,
  HvInput,
  HvOption,
  HvRadio,
  HvRadioGroup,
  HvSelect,
  HvTextArea,
  HvTimePicker,
} from "@hitachivantara/uikit-react-core";
import { Phone } from "@hitachivantara/uikit-react-icons";

const countries = [
  { id: "pt", label: "Portugal" },
  { id: "sp", label: "Spain" },
  { id: "fr", label: "France" },
  { id: "de", label: "Germany" },
  { id: "us", label: "United States" },
];

const Form = () => (
  <form
    autoComplete="on"
    onSubmit={(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      alert(JSON.stringify(Object.fromEntries(formData), null, 2));
    }}
  >
    <HvGrid container maxWidth="md" rowSpacing="xs">
      <HvGrid item xs={12} sm={6}>
        <HvInput required name="name" label="Full Name" />
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvInput required type="email" name="email" label="Email" />
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvInput name="street-address" label="Address" />
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvSelect
          required
          name="country"
          label="Country"
          statusMessage="Country is required"
        >
          {countries.map(({ id, label }) => (
            <HvOption key={id} value={id}>
              {label}
            </HvOption>
          ))}
        </HvSelect>
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvInput name="tel" label="Phone number" endAdornment={<Phone />} />
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvInput type="password" name="password" label="Password" />
      </HvGrid>
      <HvGrid item xs={12} component="hr" />
      <HvGrid item xs={12} sm={6}>
        <HvDatePicker name="bday" label="Birthday" placeholder="Select date" />
      </HvGrid>
      <HvGrid item xs={12} sm={6}>
        <HvTimePicker name="startTime" label="Start time" />
      </HvGrid>
      <HvGrid item xs={12} component="hr" />
      <HvGrid item xs={12}>
        <HvTextArea
          required
          name="description"
          description="Write a short description"
          label="Description"
          rows={3}
          inputProps={{ minLength: 16, maxLength: 128 }}
          minCharQuantity={16}
          maxCharQuantity={128}
        />
      </HvGrid>
      <HvGrid item xs={12}>
        <HvRadioGroup required name="sex" label="Sex" orientation="horizontal">
          <HvRadio value="male" label="Male" />
          <HvRadio value="female" label="Female" />
          <HvRadio value="other" label="Other" />
        </HvRadioGroup>
      </HvGrid>
      <HvGrid item xs={12}>
        <HvCheckBox
          defaultChecked
          name="subscribe"
          label="Subscribe to newsletter"
          value="yes"
        />
      </HvGrid>
      <HvGrid item xs={12}>
        <HvButton type="submit">Submit</HvButton>
      </HvGrid>
    </HvGrid>
  </form>
);

export { Form as Component };

export default Form;
