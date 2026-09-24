import { HvGrid, HvButton } from "@pentaho/uikit-react-core";

export function Panel() {
  return (
    <HvGrid container spacing={2}>
      <HvGrid size={{ xs: 12, sm: 6 }} style={{ minWidth: 0 }}>
        <HvButton>Save</HvButton>
      </HvGrid>
    </HvGrid>
  );
}

export default Panel;
