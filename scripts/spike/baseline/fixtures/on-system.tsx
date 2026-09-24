// Fixture: the same panel built on-system. Should score zero.
import { HvButton, HvGrid, HvInput } from "@pentaho/uikit-react-core";

export function Panel() {
  return (
    <HvGrid size={{ xs: 12, sm: 6 }} className="p-sm">
      <div className="mb-sm">
        <HvButton onClick={() => {}}>Save</HvButton>
        <HvInput placeholder="name" />
      </div>
    </HvGrid>
  );
}
