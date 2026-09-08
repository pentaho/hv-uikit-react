import { HvIconContainer, HvInput } from "@pentaho/uikit-react-core";

export default function Demo() {
  return (
    <HvInput
      label="Leading Icon"
      className="w-300px"
      placeholder="Placeholder text..."
      startAdornment={
        <HvIconContainer>
          <div className="i-ph-user" />
        </HvIconContainer>
      }
    />
  );
}
