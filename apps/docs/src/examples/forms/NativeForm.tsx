import {
  HvButton,
  HvCheckBox,
  HvDatePicker,
  HvGrid,
  HvInput,
  HvRadio,
  HvRadioGroup,
  HvTextArea,
  HvTimePicker,
} from "@pentaho/uikit-react-core";
import { Map, Phone } from "@pentaho/uikit-react-icons";

const countries = [
  { id: "pt", label: "Portugal" },
  { id: "es", label: "Spain" },
  { id: "fr", label: "France" },
  { id: "de", label: "Germany" },
  { id: "us", label: "United States" },
];

export default () => (
  <form
    autoComplete="on"
    onSubmit={(event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      alert(JSON.stringify(Object.fromEntries(formData), null, 2));
    }}
  >
    <HvGrid container maxWidth="md" rowSpacing="xs">
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput required name="name" label="Full Name" />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput required type="email" name="email" label="Email" />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput name="street-address" label="Address" />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput
          name="country-name"
          label="Country"
          inputProps={{ autoComplete: "off" }}
          endAdornment={<Map />}
          validation={(val) => countries.some((c) => c.label === val)}
          validationMessages={{ error: "Invalid country" }}
          suggestionListCallback={(val) =>
            countries.filter((c) => c.label === val)
          }
        />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput name="tel" label="Phone number" endAdornment={<Phone />} />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvInput type="password" name="password" label="Password" />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvDatePicker name="bday" label="Birthday" placeholder="Select date" />
      </HvGrid>
      <HvGrid size={{ xs: 12, sm: 6 }}>
        <HvTimePicker name="startTime" label="Start time" />
      </HvGrid>
      <HvGrid size={12}>
        <HvTextArea
          required
          name="description"
          description="Write a short description"
          label="Description"
          rows={3}
          minCharQuantity={16}
          maxCharQuantity={128}
        />
      </HvGrid>
      <HvGrid size={12}>
        <HvRadioGroup required name="sex" label="Sex" orientation="horizontal">
          <HvRadio value="male" label="Male" />
          <HvRadio value="female" label="Female" />
          <HvRadio value="other" label="Other" />
        </HvRadioGroup>
      </HvGrid>
      <HvGrid size={12}>
        <HvCheckBox
          defaultChecked
          name="subscribe"
          label="Subscribe to newsletter"
          value="yes"
        />
      </HvGrid>
      <HvGrid size={12}>
        <HvButton type="submit">Submit</HvButton>
      </HvGrid>
    </HvGrid>
  </form>
);
