import { useState } from "react";
import { z, type typeToFlattenedError } from "zod";
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
} from "@hitachivantara/uikit-react-core";
import { Map } from "@hitachivantara/uikit-react-icons";

type Country = "Portugal" | "Spain" | "France" | "Germany" | "United States";

const passwordSchema = z
  .string()
  .min(6, "Password is too short")
  .max(32, "Password is too long")
  .refine((pwd) => /[!@#$&*]/.test(pwd), "Must include special characters.");

const formSchema = z
  .object({
    name: z
      .string({ required_error: "Name is required" })
      .min(3, "Name is too short")
      .refine((n) => !/\d/.test(n), "Name must not contain numbers"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email")
      .refine(
        (email) => email.endsWith("@hitachivantara.com"),
        "Email must be from @hitachivantara.com",
      ),
    address: z.string().optional(),
    country: z
      .enum(["Portugal", "Spain", "France", "Germany", "United States"], {
        errorMap: (issue) => ({
          message:
            issue.code === "invalid_enum_value"
              ? `Invalid country. Must be: ${String(issue.options)}`
              : "Invalid country.",
        }),
      })
      .optional(),
    tel: z.string().optional(),
    password: passwordSchema,
    repeatPassword: passwordSchema,
    bday: z
      .date()
      .min(new Date("1900-01-01"), "Too old!")
      .max(new Date("2000-12-31"), "Too young!")
      .optional(),
    startTime: z
      .object({ hours: z.number(), minutes: z.number(), seconds: z.number() })
      .optional(),
    description: z
      .string()
      .min(16, "Description is too short")
      .max(128, "Description is too long"),
    sex: z.enum(["male", "female", "other"]),
    subscribe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

type FormSchema = z.infer<typeof formSchema>;

export default () => {
  const [data, setData] = useState<Partial<FormSchema>>({});

  const setValue = <K extends keyof FormSchema>(
    name: K,
    value: FormSchema[K],
  ) => setData((prev) => ({ ...prev, [name]: value }));

  const [errors, setErrors] = useState<
    typeToFlattenedError<FormSchema>["fieldErrors"]
  >({});

  return (
    <form
      autoComplete="on"
      onSubmit={(event) => {
        event.preventDefault();
        const parsedData = formSchema.safeParse(data);

        if (parsedData.success) {
          const { data: formData } = parsedData;
          alert(JSON.stringify(formData, null, 2));
        } else {
          const formErrors = parsedData.error.formErrors.fieldErrors;
          setErrors(formErrors);
        }
      }}
    >
      <HvGrid container maxWidth="md" rowSpacing="xs">
        <HvGrid item xs={12} sm={6}>
          <HvInput
            required
            inputProps={{ required: false }} // disable default browser behavior
            name="name"
            label="Full Name"
            status={errors.name ? "invalid" : "valid"}
            statusMessage={errors.name?.[0] || ""}
            onChange={(evt, val) => setValue("name", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvInput
            required
            inputProps={{ required: false }} // disable default browser behavior
            type="email"
            name="email"
            label="Email"
            status={errors.email ? "invalid" : "valid"}
            statusMessage={errors.email?.[0] || ""}
            onChange={(evt, val) => setValue("email", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvInput
            name="address"
            label="Address"
            status={errors.address ? "invalid" : "valid"}
            statusMessage={errors.address?.[0] || ""}
            onChange={(evt, val) => setValue("address", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvInput
            name="country"
            label="Country"
            inputProps={{ autoComplete: "off" }}
            status={errors.country ? "invalid" : "valid"}
            statusMessage={errors.country?.[0] || ""}
            onChange={(evt, val) => setValue("country", val as Country)}
            endAdornment={<Map />}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvInput
            required
            inputProps={{ required: false }} // disable default browser behavior
            type="password"
            name="password"
            label="Password"
            status={errors.password ? "invalid" : "valid"}
            statusMessage={errors.password?.[0] || ""}
            onChange={(evt, val) => setValue("password", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvInput
            required
            inputProps={{ required: false }} // disable default browser behavior
            type="password"
            name="repeatPassword"
            label="Repeat password"
            status={errors.repeatPassword ? "invalid" : "valid"}
            statusMessage={errors.repeatPassword?.[0] || ""}
            onChange={(evt, val) => setValue("repeatPassword", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvDatePicker
            name="bday"
            label="Birthday"
            placeholder="Select date"
            onChange={(val) => setValue("bday", val)}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <HvTimePicker
            name="startTime"
            label="Start time"
            onChange={(val) => setValue("startTime", val)}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <HvTextArea
            required
            inputProps={{ required: false }} // disable default browser behavior
            name="description"
            description="Write a short description"
            label="Description"
            rows={3}
            minCharQuantity={16}
            maxCharQuantity={128}
            status={errors.description ? "invalid" : "valid"}
            statusMessage={errors.description?.[0] || ""}
            onChange={(evt, val) => setValue("description", val)}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <HvRadioGroup
            required
            name="sex"
            label="Sex"
            orientation="horizontal"
            status={errors.sex ? "invalid" : "valid"}
            statusMessage={errors.sex?.[0] || ""}
            onChange={(evt, val) => setValue("sex", val)}
          >
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
            onChange={(evt, val) => setValue("subscribe", val)}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <HvButton type="submit">Submit</HvButton>
        </HvGrid>
      </HvGrid>
    </form>
  );
};
