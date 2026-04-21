import {
  Controller,
  useController,
  useForm,
  type ControllerProps,
  type FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  type HvFormElementProps,
  type HvInputProps,
} from "@hitachivantara/uikit-react-core";
import { Map } from "@hitachivantara/uikit-react-icons";

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
              ? `Invalid country. Must be: ${issue.options}`
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

const getStatusProps = (error?: FieldError) => {
  return {
    status: error ? "invalid" : "valid",
    statusMessage: error?.message || "",
  } satisfies HvFormElementProps;
};

interface InputControlProps
  extends
    Pick<ControllerProps<FormSchema>, "name" | "control">,
    Omit<HvInputProps, "name">,
    Record<string, any> {
  component?: any;
}

const InputControl = ({
  name,
  control,
  label,
  component: Component = HvInput,
  ...others
}: InputControlProps) => {
  const { field, fieldState } = useController({ name, control });

  return (
    <Component
      {...field}
      value={field.value ?? ""} // ensure controlled behavior
      label={label || name}
      {...getStatusProps(fieldState.error)}
      {...others}
    />
  );
};

export default () => {
  const { handleSubmit, control } = useForm<FormSchema>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "male",
      subscribe: true,
      startTime: { hours: 9, minutes: 0, seconds: 0 },
    },
  });

  return (
    <form
      autoComplete="on"
      onSubmit={handleSubmit(
        (data) => alert(JSON.stringify(data, null, 2)),
        (errors) => console.error("Form errors", errors),
      )}
    >
      <HvGrid container maxWidth="md" rowSpacing="xs">
        <HvGrid item xs={12} sm={6}>
          <InputControl control={control} name="name" label="Full Name" />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl control={control} name="email" label="Email" />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl control={control} name="address" label="Address" />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl
            control={control}
            name="country"
            label="Country"
            inputProps={{ autoComplete: "off" }}
            endAdornment={<Map />}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl
            control={control}
            type="password"
            name="password"
            label="Password"
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl
            control={control}
            type="password"
            name="repeatPassword"
            label="Repeat password"
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <Controller
            control={control}
            name="bday"
            render={({ field, fieldState: { error } }) => (
              <HvDatePicker
                {...field}
                label="Birthday"
                placeholder="Select date"
                {...getStatusProps(error)}
              />
            )}
          />
        </HvGrid>
        <HvGrid item xs={12} sm={6}>
          <InputControl
            control={control}
            component={HvTimePicker}
            name="startTime"
            label="Start time"
            // TODO: onchange?
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <InputControl
            control={control}
            component={HvTextArea}
            name="description"
            label="Description"
            description="Write a short description"
            rows={3}
            minCharQuantity={16}
            maxCharQuantity={128}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <Controller
            control={control}
            name="sex"
            render={({ field, fieldState: { error } }) => (
              <HvRadioGroup
                {...field}
                label="Sex"
                orientation="horizontal"
                {...getStatusProps(error)}
              >
                <HvRadio value="male" label="Male" />
                <HvRadio value="female" label="Female" />
                <HvRadio value="other" label="Other" />
              </HvRadioGroup>
            )}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <Controller
            control={control}
            name="subscribe"
            render={({ field, fieldState: { error } }) => (
              <HvCheckBox
                {...field}
                value="yes"
                checked={field.value}
                label="Subscribe to newsletter"
                {...getStatusProps(error)}
              />
            )}
          />
        </HvGrid>
        <HvGrid item xs={12}>
          <HvButton type="submit">Submit</HvButton>
        </HvGrid>
      </HvGrid>
    </form>
  );
};
