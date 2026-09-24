import { HvGrid, HvButton } from "@hitachivantara/uikit-react-core";

export function Panel() {
  return (
    <HvGrid container spacing={2}>
      <HvGrid xs={12} sm={6}>
        <HvButton>Save</HvButton>
      </HvGrid>
    </HvGrid>
  );
}

export default Panel;
